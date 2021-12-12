import bpy
import os
import json
##
def export_pose_library(folder, num_frames):
    def data_path_to_part_component(data_path):
        splitted = data_path.split('"')
        part = splitted[1]
        component = splitted[2].split("'")[0][2:]
        return (part, component)
    ##
    def add_value(dictionary, part, component, axis, value):
        if not part in dictionary.keys():
            dictionary[part] = {}
        if not component in dictionary[part].keys():                
            if part == 'rotation_quaternion':
                dictionary[part][component] = {'w':1.0, 'x':0.0, 'y':0.0, 'z':0.0}
            else:
                dictionary[part][component] = {'x':0.0, 'y':0.0, 'z':0.0}
        dictionary[part][component][axis] = value            
    ##
    def add_to_pose(pose_dict, data_path, array_index, value):
        part_component = data_path_to_part_component(data_path)
        part = part_component[0]
        component = part_component[1]
        if component == 'rotation_quaternion':
            if array_index == 0:
                axis = 'w'
            elif array_index == 1:
                axis = 'x'
            elif array_index == 2:
                axis = 'y'
            elif array_index == 3:
                axis = 'z'
            else:
                print("UNKNOWN INDEX = " + str(array_index) + ' part=' +  str(part))
        else:
            if array_index == 0:
                axis = 'x'
            elif array_index == 1:
                axis = 'y'
            elif array_index == 2:
                axis = 'z'
            else:
                print("UNKNOWN INDEX = " + str(array_index) + ' part=' +  str(part))
        #
        add_value(pose_dict, part, component, axis, value)
        ##
    def export_frame(folder, num):
        #stringa = ''
        filename = os.path.join(folder, './pose_'+str(num).zfill(4)+'.json')
        fout = open(filename, 'w')
        cur = bpy.data.actions["PoseLib"].id_data.fcurves
        pose = {}
        for fc in cur:
            add_to_pose(pose, fc.data_path, fc.array_index, fc.evaluate(num))
            #stringa += str((fc.data_path, fc.array_index, fc.evaluate(num))) + '\n'
        #print(pose)
        json.dump(pose, fout, indent=4)
        #fout.write(stringa)
        fout.close()
        return pose
    ##
    for index in range(num_frames):
        export_frame(folder, index+1)



