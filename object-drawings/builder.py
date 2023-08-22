import os
import sys
from shutil import rmtree

from canvasdraw.parser import parse

from config import fills, copy


COLLAPSE = False
MINIFY = False
SEPERATE_FILES = False


js_functions = []

def write_js(javascript:str, name:str) -> None:
    if SEPERATE_FILES:
        with open('output/' + name + '.js', 'w') as file:
            file.writelines(javascript)
        return
    content = ''
    js = 'export function ' + name + ' () {\n'
    for line in javascript:
        content += '\t'
        content += line
        content += '\n'
    if COLLAPSE:
        content = content.replace('\n', '')
        content = content.replace('\t', '')
        content = '\t' + content + '\n'
    js += content
    js += '};\n'
    if MINIFY:
        js = js.replace('\n', '')
        js = js.replace('\t', '')
    js_functions.append(js)


if __name__ == '__main__':
    if '--collapse' in sys.argv:
        COLLAPSE = True
    if '--minify' in sys.argv:
        MINIFY = True
    if '--seperate-files' in sys.argv:
        SEPERATE_FILES = True

    if SEPERATE_FILES:
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
                    output_path = template.split('/')[-1].replace('template', output_name).replace('.cnvsdrw', '')
                    write_js(js, output_path)
    
    for file in copy:
        with open(file) as f:
            lines = f.read().split(';')
            lines = [line.strip() for line in lines]
            js = parse(lines)
            output_path = file.split('/')[-1].replace('.cnvsdrw', '')

            write_js(js, output_path)
    
    if not SEPERATE_FILES:
        with open('output.js', 'w') as output_file:
            output_file.writelines(js_functions)