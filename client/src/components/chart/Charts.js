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
    const zAxis = [];
    const time = [];
    for (i = 0; i < data.testData.length; i++) {
      zAxis.push(data.testData[i].zAxis)
      time.push(data.testData[i].time)
    }
    const indexOfMaxValue = zAxis.indexOf(Math.max(...zAxis));

    return (
      <div>
        {/* Line Chart */}
        <div className="row">
          <div className="column">
            <h2>Deviation along the Z axis</h2>
              <LineChart width={500} height={300} data={data.testData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis dataKey="zAxis" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="zAxis" stroke="#82ca9d" />
              </LineChart>        
            </div>
          <div className="column">
            <h2>Key Figures</h2>
            <p>Maximum deflection in Z : {Math.max(...zAxis)} N</p>
            <p>Time to max deflection in Z : {time[indexOfMaxValue]} s</p>
          </div>
        </div>
        {/* Scatter Chart */}
        <div className="row">
          <div className="column">
            <h2>Scatter Chart X and Y axis</h2>
              <ScatterChart width={730} height={250} data={data.testData} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="xAxis" name="X axis" unit="N" />
                <YAxis dataKey="yAxis" name="Y Axis" unit="N" />
                <ZAxis dataKey="time"  name="time" unit="s" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              </ScatterChart>
          </div>
          <div className="column">
            <h2>Key Figures</h2>
          </div>
        </div>
      </div>
      );
}


export default Charts