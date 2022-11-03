import { TreeSelectProps } from "./TreeSelect.cofing"
import DropdownTreeSelect from 'react-dropdown-tree-select'
import { data } from "./dummy"
import { Space, Switch, TreeSelect } from 'antd';
import { useState } from "react";
import 'antd/dist/antd.css';

const { TreeNode } = TreeSelect;

const TreeSelectComponent: React.FC<TreeSelectProps> = ({ data, onChange }) => {

    const [treeLine] = useState(true);

    return (
        <div className='w-full bg-black'>
            <Space direction="vertical">
                <TreeSelect
                    treeLine={treeLine} style={{ color: "black", width: 350 }}
                    onChange={onChange}
                    placeholder={"Select............"}>
                    {data.length > 0 && data.map((e: any, i) => {
                        return (
                            <TreeNode
                                key={i}
                                value={e.id}
                                title={e.name}>
                                {/* {e.parent != undefined && <TreeNode value={e.parent.id} title={e.parent.name} />} */}
                                <TreeNode value={e?.parent?.id} title={e?.parent?.name} />
                            </TreeNode>
                        )
                    })}
                </TreeSelect>
            </Space>
        </div>
    )
}

export default TreeSelectComponent