import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import {
  GanttComponent,
  Inject,
  Selection,
  ColumnsDirective,
  ColumnDirective,
} from '@syncfusion/ej2-react-gantt';
import { projectNewData } from './data';
import { updateSampleSection } from './sample-base';
import { QueryBuilderComponent } from '@syncfusion/ej2-react-querybuilder';
import { Query, DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';

function Default() {
  let qryBldrObj;
  let ganttObj;
  React.useEffect(() => {
    updateSampleSection();
  }, []);
  const taskFields = {
    id: 'OrderID',
    name: 'ShipName',
    startDate: 'ShippedDate',
    endDate: 'RequiredDate',
    progress: 'Freight',
  };

  var columnData = [
    { field: 'OrderID', label: 'TaskID', type: 'number' },
    { field: 'ShipName', label: 'TaskName', type: 'string' },
    { field: 'Freight', label: 'Progress', type: 'number' },
    {
      field: 'ShippedDate',
      label: 'StartDate',
      type: 'date',
      format: 'dd/MM/yyyy',
    },
    {
      field: 'RequiredDate',
      label: 'EndDate',
      type: 'date',
      format: 'dd/MM/yyyy',
    },
  ];

  var data = new DataManager({
    url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Orders/',
    adaptor: new ODataV4Adaptor(),
  });

  const importRules = {
    condition: 'and',
    rules: [
      {
        label: 'TaskName',
        field: 'TaskName',
        type: 'string',
        operator: 'equal',
        value: 'Defining target audience',
      },
    ],
  };

  function updateRule(args) {
    let predicate = qryBldrObj.getPredicate(args.rule);
    //var query;
    if (predicate) {
      ganttObj.query = new Query()
        .select([
          'OrderID',
          'ShipName',
          'ShippedDate',
          'RequiredDate',
          'Freight',
        ])
        .where(predicate);
    } else {
      ganttObj.query = new Query().select([
        'OrderID',
        'ShipName',
        'ShippedDate',
        'RequiredDate',
        'Freight',
      ]);
    }
    //console.log(query);
    ganttObj.refresh();
  }

  const labelSettings = {
    leftLabel: 'TaskName',
  };
  const projectStartDate = new Date('07/04/1996');
  const projectEndDate = new Date('09/06/1996');
  return (
    <div className="control-pane">
      <QueryBuilderComponent
        dataSource={data}
        columns={columnData}
        //rule={importRules}
        ruleChange={updateRule}
        ref={(scope) => {
          qryBldrObj = scope;
        }}
      />
      <div className="control-section">
        <GanttComponent
          // id="Default"
          dataSource={data}
          //treeColumnIndex={1}
          taskFields={taskFields}
          //labelSettings={labelSettings}
          //height="410px"
          //projectStartDate={projectStartDate}
          //projectEndDate={projectEndDate}
          ref={(scope) => {
            ganttObj = scope;
          }}
        >
          <ColumnsDirective>
            <ColumnDirective field="OrderID" width="80"></ColumnDirective>
            <ColumnDirective
              field="ShipName"
              headerText="Job Name"
              width="250"
              clipMode="EllipsisWithTooltip"
            ></ColumnDirective>
            <ColumnDirective field="ShippedDate"></ColumnDirective>
            <ColumnDirective field="RequiredDate"></ColumnDirective>
            <ColumnDirective field="Freight"></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[Selection]} />
        </GanttComponent>
      </div>
    </div>
  );
}
export default Default;

const root = createRoot(document.getElementById('sample'));
root.render(<Default />);
