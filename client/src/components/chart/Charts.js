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
    for (i = 0; i < data.testData.length; i++) {
        nominalForce.push(data.testData[i]["Normal Force (N) Run 1_2"])
        time.push(data.testData[i]["Time (s) Run 1"])
    }
    const indexOfMaxValue = nominalForce.indexOf(Math.max(...nominalForce));

    const reactionTime= 0.437

    const date = new Date(data.date).toString();

    return (
      <div class='quodrant'>
          <div class='qtop'>

              <div class='quodrant1'>
                <ResponsiveContainer width="95%" height={400}>
                  <LineChart width={800} height={450} data={data.testData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Time (s) Run 1" unit="s" type="number" domain={['2.3', '4.3']}/>
                    <YAxis dataKey="Normal Force (N) Run 1" unit=" N" type="number" domain={['auto', 'auto']}/>
                    <Tooltip />
                    <Legend />
                    <Line name="Normal Force - Left Plate" type="monotone" dataKey="Normal Force (N) Run 1" stroke="#82ca9d" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div class='quodrant2'>
                <ResponsiveContainer width="95%" height={400}>
                    <LineChart width={800} height={450} data={data.testData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Time (s) Run 1" unit="s" type="number" domain={['2.3', '4.3']}/>
                      <YAxis dataKey="Normal Force (N) Run 1_2" unit=" N" type="number" domain={['auto', 'auto']}/>
                      <Tooltip />
                      <Legend />
                      <Line name="Normal Force - Left Plate" type="monotone" dataKey="Normal Force (N) Run 1_2" stroke="#82ca9d" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
              </div>

          </div>
          <div class='qbottom'>

              <div class='quodrant3'>
                <ResponsiveContainer width="95%" height={400}>
                  <ScatterChart width={800} height={450} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Parallel Force (N) Run 1" name="L/R" unit=" N" type="number" domain={['auto', 'auto']}/>
                    <YAxis dataKey="Parallel Force (N) Run 1_2" name="U/D" unit=" N" type="number" domain={['auto', 'auto']}/>
                    <ZAxis dataKey="Normal Force (N) Run 1_2" name="Z" unit=" N" range={[10, 300]}/>
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Scatter Intesity" data={data.testData} fill="#8884d8" shape="cross"/>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div class='quodrant4'>
                <h1 class="headertekst"> Key Figures </h1>
                <br></br>
                <p class="para">Maximum deflection in Z : &nbsp; <span class="value">{Math.max(...nominalForce)} N</span></p>
                <p class="para">Time to max deflection in Z : &nbsp; <span class="value">{time[indexOfMaxValue]} s</span></p>
                <p class="para">Reaction time: &nbsp; <span class="value">{reactionTime} s</span></p>
                <br></br>
                <br></br>            
                <p class="para2">Date and time of test: &nbsp; {date.substr(0, date.length - 40)}</p>
              </div>

          </div>
      </div>
      );
}


export default Charts