import React ,  { useState } from "react";




const WorkerStats = (props) => {
    const workers = props.workers;
    const set_select_id = props.set_select_id;

    const [sortType, setSortType] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [hoveredRow, setHoveredRow] = useState(null);

    const initialData = Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      workTimes: {
        planning: Math.random() * 2 + 0.5,
        development: Math.random() * 4 + 2,
        testing: Math.random() * 2 + 0.5
      }
    }));

    
    const workTypes = [
        { key: "inspect", label: "検品", color:  "rgb(101, 116, 147)"},
        { key: "transport", label: "搬送", color: "rgb(216, 101, 96)" },
        { key: "sorting", label: "仕訳", color: "rgb(143, 186, 155)" },
      ];
/*    
    const workTypes = [
      { key: 'planning', label: '計', color: 'rgb(96, 165, 250)' },
      { key: 'development', label: '開', color: 'rgb(74, 222, 128)' },
      { key: 'testing', label: 'テ', color: 'rgb(192, 132, 252)' }
    ];
  */
    const getTotalTime = (workTimes) => {
      return Object.values(workTimes).reduce((sum, time) => sum + time, 0);
    };
  
    const sortData = (data) => {
      return [...data].sort((a, b) => {
        let comparison = 0;
        if (sortType === 'id') {
          comparison = a.id - b.id;
        } else if (sortType === 'total') {
          comparison = getTotalTime(a.workTimes) - getTotalTime(b.workTimes);
        }else if (sortType === 'distance') {
            comparison = a.distance- b.distance;
        }else if (sortType === 'inspect') {
            comparison = a.workTimes.inspect - b.workTimes.inspect;
        }else if (sortType === 'transport') {
            comparison = a.workTimes.transport - b.workTimes.transport;
        }else if (sortType === 'sorting') {
            comparison = a.workTimes.sorting - b.workTimes.sorting; 
          }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    };
  
    const handleSort = (type) => {
      if (sortType === type) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortType(type);
        setSortDirection('asc');
      }
    };

    
  
    const sortedData = sortData(workers);
    const maxTotalTime = Math.max(...sortedData.map(item => getTotalTime(item.workTimes)));
  
    const SortButton = ({ type, label }) => {
      const isActive = sortType === type;
      return (
        <button
          onClick={() => handleSort(type)}
          style={{
            color: isActive ? '#2d3748' : '#8b85e1',
            padding: '2px 3px',
            fontSize: '11px',
            backgroundColor: isActive ? '#e2e8f0' : '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            marginRight: '2px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          {label}
          {isActive && (
            <span style={{ fontSize: '8px', marginLeft: '2px' }}>
              {sortDirection === 'asc' ? '▲' : '▼'}
            </span>
          )}
        </button>
      );
    };
  
    return (
      <div style={{ fontSize: '11px' }} className="p-2 rounded-lg shadow-sm">
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <SortButton type="id" label="ID" />
            <SortButton type="distance" label="距" />
            <SortButton type="inspect" label="検" />
            <SortButton type="transport" label="搬" />
            <SortButton type="sorting" label="仕" />
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '8px',
            borderLeft: '1px solid #cbd5e1',
            paddingLeft: '8px'
          }}>
            {workTypes.map(type => (
              <div key={type.key} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <div 
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '2px',
                    backgroundColor: type.color 
                  }}
                ></div>
                <span>{type.label}</span>
              </div>
            ))}
          </div>
        </div>
  
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{/*</tr> style={{ borderBottom: '1px solid #eee' }}>*/}
              <th style={{ padding: '2px', textAlign: 'center', width: '20px' }}>ID</th>
              <th style={{ padding: '2px', textAlign: 'left', width: '48px' }}>移動距離</th>
              <th style={{ padding: '2px', textAlign: 'left' }}>作業内訳（推定）</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => {
            // const totalTime = getTotalTime(item.workTimes);
              const distance = item.distance;
              const isHovered = hoveredRow === item.id;
              return (
                <tr 
                    key={item.id} 
                    onClick={()=>set_select_id(item.id)}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ 
                        backgroundColor: isHovered?'#353575':'transparent',
                    }}>
                  <td style={{ padding: '0px 2px', textAlign:'right'}}>{item.id}</td>
                  <td style={{ padding: '0px 2px', textAlign:'right'}}>{distance.toFixed(0)}m</td>
                  <td style={{ padding: '0px 2px' }}>
                    <div style={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: '12px', 
                      backgroundColor: '#f5f5f5',
                      borderRadius: '2px'
                    }}>
                      {workTypes.reduce((acc, type, index) => {
                        const prevWidth = acc.width;
                        const width = (item.workTimes[type.key] / maxTotalTime) * 100;
                        
                        return {
                          width: prevWidth + width,
                          element: (
                            <>
                              {acc.element}
                              <div
                                style={{
                                  position: 'absolute',
                                  left: `${prevWidth}%`,
                                  width: `${width}%`,
                                  height: '14px',
                                  backgroundColor: type.color,
                                  transition: 'all 0.3s',
                                  borderRadius: index === workTypes.length - 1 ? '0 2px 2px 0' : '0',
                                  borderTopLeftRadius: index === 0 ? '2px' : '0',
                                  borderBottomLeftRadius: index === 0 ? '2px' : '0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <span style={{
                                  fontSize: '10px',
                                  color: width < 15 ? 'transparent' : 'rgba(0,0,0,0.7)'
                                }}>
                                  {item.workTimes[type.key].toFixed(1)}
                                </span>
                              </div>
                            </>
                          )
                        };
                      }, { width: 0, element: null }).element}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
};


export default WorkerStats;
