html = open("work/template.html", encoding="utf-8").read()
data = open("work/data.json", encoding="utf-8").read()
open("kinetic.html", "w", encoding="utf-8").write(html.replace("/*DATA*/null", data))
print("built")
