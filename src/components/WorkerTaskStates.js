
import ModelLabel from "./ModelLabel"

// 各ワーカのタスク状態を表示 

// id, pos, txt
// 

const WorkerTaskStates = ({task_info,task_label}) =>{

//    console.log("GOt",task_info.length)
    return(
        <>
        {
            task_label?
                task_info.map((info)=>(
                    <ModelLabel 
                        key={info.id}
                        id={info.id}
                        position={info.pos}
                        label={info.label}
                        metadata={info.txt}></ModelLabel>
                )) :<div></div>
        }
        </>
    )
}

export default WorkerTaskStates;
