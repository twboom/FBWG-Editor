import os
from shutil import rmtree

from canvasdraw.parser import parse

from config import fills, copy

if __name__ == '__main__':
    if os.path.exists('output'):
        rmtree('output')
    os.mkdir('output')

    for fill in fills:
        for template in fill['templates']:
            with open(template, 'r') as file:
                text = file.read()
                for idx, output_name in enumerate(fill['output_names']):
                    text_copy = text
                    for key, value in fill['vars'].items():
                        text_copy = text_copy.replace('{{' + key + '}}', value[idx])
                    lines = text_copy.split(';')
                    lines = [line.strip() for line in lines]
                    js = parse(lines)
                    output_path = template.split('/')[-1].replace('template', output_name).replace('cnvsdrw', 'js')
                    with open('output/' + output_path, 'w') as out:
                        out.writelines(js)
    
    for file in copy:
        with open(file) as f:
            lines = f.read().split(';')
            lines = [line.strip() for line in lines]
            js = parse(lines)
            output_path = file.split('/')[-1].replace('cnvsdrw', 'js')
            with open('output/' + output_path, 'w') as out:
                out.writelines(js)