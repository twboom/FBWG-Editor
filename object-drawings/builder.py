import os
import sys
from shutil import rmtree

from canvasdraw.parser import parse

from config import fills, copy


COLLAPSE = False
MINIFY = False
SEPERATE_FILES = False
COMMAND_OUTPUT = True
INCLUDE_WRAPPER = True
EXPORT_INDIVIDUAL = False


js_functions = []
js_functions_names = []

def write_js(javascript:str, name:str) -> None:
    if COMMAND_OUTPUT: print('Processed ' + name)
    if SEPERATE_FILES:
        with open('output/' + name + '.js', 'w') as file:
            file.writelines(javascript)
        return
    content = ''
    js = 'function ' + name + ' (ctx) {\n'
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
    if not INCLUDE_WRAPPER or EXPORT_INDIVIDUAL:
        js = 'export ' + js
    js_functions.append(js)
    js_functions_names.append(name)


if __name__ == '__main__':
    if '--collapse' in sys.argv:
        COLLAPSE = True
    if '--minify' in sys.argv:
        MINIFY = True
    if '--seperate-files' in sys.argv:
        SEPERATE_FILES = True
    if '--no-command-output' in sys.argv:
        COMMAND_OUTPUT = False
    if '--discard-wrapper' in sys.argv:
        INCLUDE_WRAPPER = False
    if '--export-individual' in sys.argv:
        EXPORT_INDIVIDUAL = True

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
                    lines = [line for line in lines if line.strip()]
                    js = parse(lines)
                    output_path = template.split('/')[-1].replace('template', output_name).replace('.cnvsdrw', '')
                    write_js(js, output_path)
    
    for file in copy:
        with open(file) as f:
            lines = f.read().split(';')
            lines = [line.strip() for line in lines]
            lines = [line for line in lines if line.strip()]
            js = parse(lines)
            output_path = file.split('/')[-1].replace('.cnvsdrw', '')

            write_js(js, output_path)
    
    if not SEPERATE_FILES:
        output_content = ''
        with open('output.js', 'w') as output_file:
            if INCLUDE_WRAPPER:
                with open('wrapper.js') as wrapper:
                    text = wrapper.read()
                    switch_content = ''
                    for name in js_functions_names:
                        case = ''
                        case += 'case "' + name + '":\n'
                        case += '\t' + name + '(ctx);\n'
                        case += '\tbreak;\n'
                        switch_content += case
                    switch_content = switch_content.replace('\n', '\n\t\t')
                    text = text.replace("case 'switch_content': break;", switch_content)
                    output_content += text + '\n'
            for func in js_functions:
                output_content += func
            if MINIFY:
                output_content = output_content.replace('\n', '')
                output_content = output_content.replace('\t', '')
            output_file.write(output_content)