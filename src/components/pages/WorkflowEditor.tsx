import {

  ReactFlowProvider,

} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WorkflowContent } from '../workflows/WorkflowContent';

// Import các thành phần của bạn





export const WorkflowEditor = () => (
  <ReactFlowProvider>
    <WorkflowContent />
  </ReactFlowProvider>
);