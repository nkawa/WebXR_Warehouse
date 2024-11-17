"use client";
import * as React from 'react'
import "./controller.css";
import WorkerStats from '../../components/WorkerStats';
import PalletStats from '../../components/PalletStats';

export default function Controller(props) {
  const {min_frame} = props
  const {cur_frame, max_frame, set_cur_frame, set_max_frame} = props
  const {disp_mode, set_disp_mode, frame_step, set_frame_step} = props
  const {ptrace_mode, set_ptrace_mode} = props;
  const {label_mode, set_label_mode, worker_mode,set_worker_mode, task_label, set_task_label} = props;
  const {worker_disp, set_worker_disp, worker_stat, set_worker_stat} = props;
  const {select_id,set_select_id,select_pid, set_select_pid, pstat_disp, set_pstat_disp} = props;
  const {pallet_stat} = props;
  const {min_mode, set_min_mode, interval_time, set_interval_time} = props;
  const {pinfo_disp, set_pinfo_disp,pallet_info, set_pallet_info} = props;

  const on_set_cur_frame = (e)=>{
    let value = Number.parseFloat(e.target.value || 0)
    props.set_cur_frame(value)
  }

  const on_set_frame_step = (e)=>{
    let value = Number.parseFloat(e.target.value || 0)
//
    set_frame_step(value);
  }

  const on_set_interval_time = (e)=>{
    let value = Number.parseFloat(e.target.value || 0)
//
    set_interval_time(value);
  }


  const change_disp_mode  = ()=>{
    console.log("Disp-mode:", disp_mode)
    if (disp_mode == "None") {
      set_disp_mode("3D")
    } else {
      set_disp_mode("None")
    }   
  }
  
  const change_ptrace_mode  = (e)=>{
    console.log("Ptrace-mode:", e.target.checked)
    set_ptrace_mode(e.target.checked);
  }

  const change_label_mode  = (e)=>{
    set_label_mode(e.target.checked);
  }

  const change_task_label  = (e)=>{
    set_task_label(e.target.checked);
  }
  const change_worker_mode  = (e)=>{
    set_worker_mode(e.target.checked);
  }

  const change_worker_disp  = (e)=>{
    set_worker_disp(e.target.checked);
  }

  const change_pstat_disp  = (e)=>{
    set_pstat_disp(e.target.checked);
  }
  const change_pinfo_disp  = (e)=>{
    set_pinfo_disp(e.target.checked);
  }

  const change_min_mode  = (e)=>{
    set_min_mode(e.target.checked);
  }

  const frame_to_time = (frame) => {
    let sec = frame / 2.5;
    let hour = Math.floor(sec / 3600);
    sec -= hour * 3600;
    let min = Math.floor(sec / 60);
    sec -= min * 60;
    sec = Math.floor(sec*10)/10;
    hour += 7; // default offset
    // 2桁になるようにゼロパディング
    const hourStr = String(hour).padStart(2, '0');
    const minStr = String(min).padStart(2, '0');
    const secStr = String(sec.toFixed(1)).padStart(4, '0'); // 小数点を含むため4桁に調整

    return `${hourStr}:${minStr}:${secStr} / `+frame+":"+frame_step;
  }


  return (
    <>

      <div className="controller" >
        <div className="row mb-0">
          <div className="col-md-4"><label htmlFor="frame_time" className="form-label"><span className="form-control-plaintext">現在時刻</span></label></div>
          <div className="col-md-2"><input type="string" className="form-center-control" id="frame_time" value={frame_to_time(cur_frame)} readOnly/></div>
        </div>
        <div className="row mb-0">
          <div className="col-md-4"><label htmlFor="disp_mode" className="form-label"><span className="form-control-plaintext">表示オプション</span></label></div>
          <div className="col-md-2">
            <label><input type="checkbox" className="form-center-control" id="worker_mode" checked={worker_mode} onChange={change_worker_mode}/> Worker  </label> 
            <label><input type="checkbox" className="form-center-control" id="clabel_mode" checked={label_mode} onChange={change_label_mode}/> Label </label> 
            <label><input type="checkbox" className="form-center-control" id="label_mode" checked={task_label} onChange={change_task_label}/> Task</label> 
            <br/>
            <label><input type="checkbox" className="form-center-control" id="label_work" checked={worker_disp} onChange={change_worker_disp}/> Stats</label>
          </div>
          <div className="col-md-2">
            <label><input type="checkbox" className="form-center-control" id="pt" checked={ptrace_mode} onChange={change_ptrace_mode}/> Pallet Trace  </label>
            <label><input type="checkbox" className="form-center-control" id="disp_mode" onChange={change_disp_mode}/> Stack </label>
            <br/>
            <label><input type="checkbox" className="form-center-control" id="pstats" checked={pstat_disp} onChange={change_pstat_disp}/> PalStats </label>
            <label><input type="checkbox" className="form-center-control" id="pinfo" checked={pinfo_disp} onChange={change_pinfo_disp}/> Info</label>
          </div>
          <div className="col-md-2">
          <div className="col-md-4"><label htmlFor="disp_mode" className="form-label"><span className="form-control-plaintext">再生関係</span></label></div>
            <label><input type="checkbox" className="form-center-control" id="min" checked={min_mode} onChange={change_min_mode}/> 11:00~  </label>
          </div>
        </div>

      </div>
      
      { 
      (worker_disp)? 
      <div className="worker-list" >
        <WorkerStats workers={worker_stat} set_select_id={set_select_id} select_id={select_id}/>
      </div>
      : <></>      
      }

      {
        (pstat_disp)?(
         (worker_disp)?
          <div className="pstat-center-list" >
            <PalletStats pallets={pallet_stat} set_select_pid={set_select_pid} select_pid={select_pid}/>
         </div>:
          <div className="pstat-list" >
            <PalletStats pallets={pallet_stat} set_select_pid={set_select_pid} select_pid={select_pid}/>
        </div>):
        <></>
      }

      <div className="frame-controller" >
        <div className="row mb-0">
          <div className="col-md-12">
            <input type="range" value={cur_frame} min={min_frame} max={max_frame} step={1} onChange={on_set_cur_frame}
                className="xr-input-range" id="frame" />
           </div>
          </div>
          <div className="col-md-12">
            <input type="range" value={frame_step} min={1} max={200} step={1} width={500} onChange={on_set_frame_step}
                className="xr-input-range-sm" id="frame" />
                 
            <input type="range" value={interval_time} min={20} max={400} step={1} width={300} onChange={on_set_interval_time}
                className="xr-input-range-sm2" id="frame" />
          </div>
      </div>

    </>
    )
}
