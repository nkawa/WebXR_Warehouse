


const load_workers = async function(){
    const res = await fetch('http://localhost:3000/worker_stat_20241003_11.json');
    const worker_stat = await res.json();
    console.log("Load workers ", worker_stat.length);
    return worker_stat; 
}

export { load_workers };
