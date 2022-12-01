import { useEffect, useState } from 'react'
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import './Style.css'
import { TreeSelect2Props } from './TreeSelect2.config'
// import isEqual from "lodash/isEqual"
// import data from './data.json'

// const data = [
//     {
//         label: 'search me',
//         value: 'searchme',
//         children: [
//           {
//             label: 'search me too',
//             value: 'searchmetoo',
//             children: [
//               {
//                 label: 'No one can get me',
//                 value: 'anonymous',
//               },
//             ],
//           },
//         ],
//       },
//       {
//         label : "agil",
//         value : "agil"
//       }
// ]

const TreeSelect2: React.FC<TreeSelect2Props> = ({
  onChange, 
  onNodeToggle, 
  data}) => {


    // const [datas, setDatas] = useState('')
    // const onChange = (currentNode : any, selectedNodes : any) => {
    //     console.log('onChange::', currentNode, selectedNodes)
    //     setDatas(currentNode.label)
    //   }

    //   console.log("datas :", datas)

    // useEffect(() => {
    // },[ data])


      const onAction = (node : any, action : any) => {
        console.log('ON ACTION :', action, node)
      }
      
    return (
        // <DropdownTreeSelect 
        // data={data} 
        // onChange={onChange}
        // mode={"radioSelect"}  />
        <DropdownTreeSelect data={data} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle}  showPartiallySelected={true} mode={'radioSelect'} />
    )
}

export default TreeSelect2  