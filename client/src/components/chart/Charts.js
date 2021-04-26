import React, { PureComponent } from 'react';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ZAxis,
    Tooltip,
    Legend,
    ScatterChart,
    Scatter,
    CartesianGrid,
    ResponsiveContainer
  } from "recharts";

import { useQuery, Loading, Error, Show, SimpleShowLayout } from 'react-admin';

const Charts = ( record ) => {
    const { data, loading, error } = useQuery({
      type: 'getOne',
      resource: 'tests',
      payload: {id: record.id}
    });

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (!data) return null;

    // Calculate key figures
    var i;
    const nominalForce = [];
    const time = [];
    for (i = 0; i < data.length; i++) {
        nominalForce.push(data[i]["Normal Force (N) Run 1_2"])
        time.push(data[i]["Time (s) Run 1"])
    }
    const indexOfMaxValue = nominalForce.indexOf(Math.max(...nominalForce));

    const reactionTime= 0.437

    return (
        <div class="wrapper">
            <div id="chart1">
                <LineChart width={800} height={450} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Time (s) Run 1" unit="s" type="number" domain={['2.3', '4.3']}/>
                  <YAxis dataKey="Normal Force (N) Run 1" unit=" N" type="number" domain={['-10', 'auto']}/>
                  <Tooltip />
                  <Legend />
                  <Line name="Normal Force - Left Plate" type="monotone" dataKey="Normal Force (N) Run 1" stroke="#82ca9d" dot={false} />
                </LineChart>        
            </div>
            <div id="chart2">
                <LineChart width={800} height={450} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Time (s) Run 1" unit="s" type="number" domain={['2.3', '4.3']}/>
                  <YAxis dataKey="Normal Force (N) Run 1_2" unit=" N" type="number"/>
                  <Tooltip />
                  <Legend />
                  <Line name="Normal Force - Right Plate" type="monotone" dataKey="Normal Force (N) Run 1_2" stroke="#82ca9d" dot={false}/>
                </LineChart>        
            </div>
            <div id="chart3">
                <ScatterChart width={800} height={450} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Parallel Force (N) Run 1" name="L/R" unit=" N" type="number" domain={['auto', 'auto']}/>
                  <YAxis dataKey="Parallel Force (N) Run 1_2" name="U/D" unit=" N" type="number" domain={['auto', 'auto']}/>
                  <ZAxis dataKey="Normal Force (N) Run 1_2" name="Z" unit=" N" range={[10, 300]}/>
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter name="Scatter Intesity" data={data} fill="#8884d8" shape="cross"/>
                </ScatterChart>
            </div>
            <div id="chart4">
                <h2>Key Figures</h2>
                <p>Maximum deflection in Z : {Math.max(...nominalForce)} N</p>
                <p>Time to max deflection in Z : {time[indexOfMaxValue]} s</p>
                <p>Reaction time: {reactionTime} s</p>
            </div>
        </div>
      );
}


export default Charts