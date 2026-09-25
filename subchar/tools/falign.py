"""Forced alignment of known Korean lyrics with the zipformer transducer (Viterbi, one symbol per frame)."""
import numpy as np, soundfile as sf, onnxruntime as ort, sentencepiece as spm, kaldi_native_fbank as knf, json, re
import os
MD=os.environ.get("CINE_MODELS") or next(p for p in ("models","../models","../../models") if os.path.isdir(p))   # model dir: $CINE_MODELS or the repo-level models/ folder
M=MD+"/sherpa-onnx-zipformer-korean-2024-06-24/"
enc=ort.InferenceSession(M+"encoder-epoch-99-avg-1.onnx");dec=ort.InferenceSession(M+"decoder-epoch-99-avg-1.onnx");joi=ort.InferenceSession(M+"joiner-epoch-99-avg-1.onnx")
sp=spm.SentencePieceProcessor(model_file=M+"bpe.model")
v,sr=sf.read("vocals16k.wav",dtype="float32")
def fbank(x):
    o=knf.FbankOptions();o.frame_opts.dither=0;o.frame_opts.samp_freq=16000;o.mel_opts.num_bins=80;o.frame_opts.snip_edges=False
    f=knf.OnlineFbank(o);f.accept_waveform(16000,(x*32768).tolist() if False else x.tolist());f.input_finished()
    return np.array([f.get_frame(i) for i in range(f.num_frames_ready)],dtype=np.float32)
def align(a,b,text,ids=None):
    x=v[int(a*sr):int(b*sr)]; x=x/ (np.abs(x).max()+1e-6)*0.5
    F=fbank(x)[None]; E=enc.run(None,{"x":F,"x_lens":np.array([F.shape[1]],np.int64)})[0][0]
    T=E.shape[0]; fr=(b-a)/T
    ids=ids if ids is not None else sp.encode(text); U=len(ids)
    ctx=[[0,0]]+[[ ([0]+ids)[u], ids[u]] if u>0 else [0,ids[0]] for u in range(U)]
    ctx=[[0,0]]+[[ids[u-2] if u>=2 else 0, ids[u-1]] for u in range(1,U+1)]
    Dout=dec.run(None,{"y":np.array(ctx,np.int64)})[0]           # (U+1,512)
    ee=np.repeat(E,U+1,0); dd=np.tile(Dout,(T,1))
    lg=joi.run(None,{"encoder_out":ee.astype(np.float32),"decoder_out":dd.astype(np.float32)})[0].reshape(T,U+1,-1)
    lp=lg-np.log(np.exp(lg-lg.max(-1,keepdims=True)).sum(-1,keepdims=True))-lg.max(-1,keepdims=True)
    NEG=-1e30;A=np.full((T+1,U+1),NEG);A[0,0]=0;Bk=np.zeros((T+1,U+1),np.int8)
    for t in range(T):
        stay=A[t]+lp[t,:,0]
        emit=np.full(U+1,NEG);emit[1:]=A[t,:-1]+lp[t,np.arange(U),ids]
        A[t+1]=np.maximum(stay,emit);Bk[t+1]=(emit>stay)
    u=U;times=[0]*U
    for t in range(T,0,-1):
        if Bk[t,u]: times[u-1]=a+(t-1)*fr; u-=1
        if u==0: break
    return [sp.id_to_piece(i) for i in ids],times
