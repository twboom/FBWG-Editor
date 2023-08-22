fills = [
    {
        'templates': [
            'drawings/spawn_template.cnvsdrw', 'drawings/diamond_template.cnvsdrw', 'drawings/door_template.cnvsdrw'
        ],
        'vars': {
            'color_fill': ['red', 'lightblue'],
            'color_stroke': ['firebrick', 'blue'],
        },
        'output_names': [
            'fb', 'wg',
        ],
    },
    {
        'templates': [
            'drawings/button_template.cnvsdrw', 'drawings/lever_left_template.cnvsdrw', 'drawings/lever_right_template.cnvsdrw'
        ],
        'vars': {
            'color_fill': ['red', 'green', 'blue', 'yellow', 'magenta', 'lightskyblue', 'blueviolet', 'white'],
            'color_stroke': ['darkred', 'darkgreen', 'darkblue', 'yellowgreen', 'purple', 'blue', 'purple', 'gray'],
        },
        'output_names': [
            '1', '2', '3', '4', '5', '6', '7', '8'
        ],
    },
    {
        'templates': [
            'drawings/box_template.cnvsdrw'
        ],
        'vars': {
            'color_fill': ['lightgray', 'gray'],
            'color_stroke': ['gray', 'black'],
        },
        'output_names': [
            'normal', 'heavy',
        ],
    },
]

copy = [
    'drawings/diamond_fbwg.cnvsdrw',
    'drawings/diamond_silver.cnvsdrw'
]