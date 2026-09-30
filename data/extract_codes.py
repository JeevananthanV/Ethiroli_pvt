import re, codecs
with codecs.open('J:/eithiroli/ethiroli_react/docs/ETH-WEB-30.md', encoding='utf-8', errors='ignore') as f:
    content = f.read()
codes = sorted(set(re.findall(r'`([A-Z]+-[A-Z0-9-]+)`', content)))
for c in codes:
    print(c)
print('Total:', len(codes))
