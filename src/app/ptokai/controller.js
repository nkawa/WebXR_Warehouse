"use client";
import * as React from 'react'
import "./controller.css";
import WorkerStats from '../../components/WorkerStats';


export default function Controller(props) {
  const {c_pos_x, c_pos_y, c_pos_z} = props
  const {c_deg_x, c_deg_y, c_deg_z} = props
  const {cur_frame, max_frame, set_cur_frame, set_max_frame} = props
  const {disp_mode, set_disp_mode, frame_step, set_frame_step} = props
  const {ptrace_mode, set_ptrace_mode} = props;
  const {label_mode, set_label_mode, worker_mode,set_worker_mode} = props;
  const {worker_disp, set_worker_disp, worker_stat, set_worker_stat} = props;
  const {set_select_id} = props;

  const set_c_pos_x = (e)=>{
    let value = Number.parseFloat(e.target.value || 0)
    props.set_c_pos_x(value)
  }

  const set_c_pos_y = (e)=>{
    let value = Number.parseFloat(e.target.value || 0)
    props.set_c_pos_y(value)
  }

  const set_c_pos_z = (e)=>{
    let value = Number.parseFloat(e.target.value || 0)
    props.set_c_pos_z(value)
  }

  const set_c_deg_x = (e)=>{
    let value = Number.parseFloat(e.target.value || 0)
    props.set_c_deg_x(value)
  }

  const set_c_deg_y = (e)=>{
    let value = Number.parseFloat(e.target.value || 0)
    props.set_c_deg_y(value)
  }

  const set_c_deg_z = (e)=>{
    let value = Number.parseFloat(e.target.value || 0)
    props.set_c_deg_z(value)
  }

  const on_set_cur_frame = (e)=>{
    let value = Number.parseFloat(e.target.value || 0)
    props.set_cur_frame(value)
  }


  const on_set_frame_step = (e)=>{
    let value = Number.parseFloat(e.target.value || 0)
    set_frame_step(value)
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

  const change_worker_mode  = (e)=>{
    set_worker_mode(e.target.checked);
  }

  const change_worker_disp  = (e)=>{
    set_worker_disp(e.target.checked);
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
          <div className="col-md-4"><label htmlFor="frame_time" className="form-label"><span className="form-control-plaintext">Cur Frame</span></label></div>
          <div className="col-md-2"><input type="string" className="form-center-control" id="frame_time" value={frame_to_time(cur_frame)} readOnly/></div>
        </div>
        <div className="row mb-0">
          <div className="col-md-4"><label htmlFor="disp_mode" className="form-label"><span className="form-control-plaintext">Disp-mode</span></label></div>
          <div className="col-md-2">
            <label><input type="checkbox" className="form-center-control" id="label_mode" checked={worker_mode} onChange={change_worker_mode}/> Worker  </label> 
            <label><input type="checkbox" className="form-center-control" id="label_mode" checked={label_mode} onChange={change_label_mode}/> Label</label> 
            <label><input type="checkbox" className="form-center-control" id="label_work" checked={worker_disp} onChange={change_worker_disp}/> Stats</label>
          </div>
          <div className="col-md-2">
            <label><input type="checkbox" className="form-center-control" checked={ptrace_mode} onChange={change_ptrace_mode}/> Pallet Trace  </label>
            <label><input type="checkbox" className="form-center-control" id="disp_mode" onChange={change_disp_mode}/> Stack </label>
          </div>
        </div>

      </div>
      
      { 
      (worker_disp)? 
      <div className="worker-list" >
        <WorkerStats workers={worker_stat} set_select_id={set_select_id}/>
      </div>
      : <></>      
      }

      <div className="frame-controller" >
        <div className="row mb-0">
          <div className="col-md-12">
            <input type="range" value={cur_frame} min={0} max={max_frame} step={1} onChange={on_set_cur_frame}
                className="xr-input-range" id="frame" />
           </div>
          </div>
          <div className="col-md-12">
            <input type="range" value={frame_step} min={1} max={500} step={1} onChange={on_set_frame_step}
                className="xr-input-range-sm" id="frame" />
          </div>
      </div>

    </>
    )
}
