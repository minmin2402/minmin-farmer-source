import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  useReactFlow,

  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Swal from "sweetalert2";

import { WorkflowSidebar } from "../WorkflowSidebar";
import { WorkflowToolbar } from "../pages/WorkflowToolbar";
import { NodePropertiesDrawer } from "../workflows/NodePropertiesDrawer"; // File drawer mình vừa tạo
import { ActionNode } from "../ActionNode";
import { Device } from "../../types/Device";
import { Workflow } from "../../types/Workflow";
import { UIInspectorModal } from "./UIInspectorModal"; // Import Modal

const nodeTypes = {
  actionNode: ActionNode,
};

const initialNodes: any[] = [
  // Hoặc dùng Node<ActionNodeData>[] nếu muốn chuẩn đét
  {
    id: "start-node",
    type: "actionNode",
    position: { x: 250, y: 50 },
    data: { label: "BẮT ĐẦU WORKFLOW", type: "start", delay: 0, handleError:"Stop workflow" },
  },
];

export const WorkflowContent = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null); // State quản lý node đang chọn
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [runningNodeId, setRunningNodeId] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState("all");
  const [devices, setDevices] = useState<Device[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [listApp, setListApp] = useState([]);
  const isStoppingRef = useRef<Boolean>(false);
  const [runningWorkflow, setRunningWorkflow] = useState(false);


  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    const saved = localStorage.getItem("minmin_workflows");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(
    null,
  );

  const [inspectorData, setInspectorData] = useState<{
    deviceId: string;
    screenshotUrl: string;
    mode: "xpath" | "coords";
  } | null>(null);

  const loadListApp = async () => {
    try {
      if (selectedDeviceId == "all") return alert("Vui lòng chọn thiết bị!");
      // 1. Chụp màn hình máy đang chọn

      // @ts-ignore
      setListApp(await window.electronAPI.listApp(selectedDeviceId));
    } catch (error) {
    } finally {
    }
  };

  // Hàm khi bấm nút UI Inspector từ Drawer
  const handleOpenXPathInspector = async () => {
    if (selectedDeviceId == "all") return alert("Vui lòng chọn thiết bị!");

    try {
      // Bây giờ "await" mới có hiệu lực và không bị báo lỗi nữa
      // @ts-ignore
      const base64Image = await window.electronAPI.screencap(selectedDeviceId);

      if (base64Image) {
        setInspectorData({
          deviceId: selectedDeviceId,
          screenshotUrl: base64Image,
          mode: "xpath", // 🚀 Chuyển sang mode coords
        });
      } else {
        alert("Không thể chụp ảnh màn hình thiết bị!");
      }
    } catch (error) {
      console.error("Lỗi khi mở Inspector:", error);
    }
  };

  // Hàm B: Mở để lấy Tọa độ (Cho node Chạm XY) 🚀🚀🚀
  const handleOpenCoordsInspector = async () => {
    try {
      if (selectedDeviceId == "all") return alert("Vui lòng chọn thiết bị!");
      // 1. Chụp màn hình máy đang chọn
      // @ts-ignore
      const base64Image = await window.electronAPI.screencap(selectedDeviceId);

      // 2. Mở Modal ở chế độ chọn tọa độ
      setInspectorData({
        deviceId: selectedDeviceId,
        screenshotUrl: base64Image,
        mode: "coords",
      });
    } catch (error) {
      console.error("Lỗi chụp màn hình:", error);
      alert("Không thể chụp màn hình thiết bị!");
    } finally {
    }
  };

  // Hàm khi người dùng bấm "Sử dụng XPath" từ Modal
  const handleSelectXY = (x: number, y: number) => {
    // 1. Điền XPath vào node đang chọn
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return { ...node, data: { ...node.data, x: x, y: y } };
          }
          return node;
        }),
      );
    }
    // 2. Đóng Modal
    setInspectorData(null);
  };
  // Hàm khi người dùng bấm "Sử dụng XPath" từ Modal
  const handleSelectXPath = (xpath: string) => {
    // 1. Điền XPath vào node đang chọn
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return { ...node, data: { ...node.data, xpath: xpath } };
          }
          return node;
        }),
      );
    }
    // 2. Đóng Modal
    setInspectorData(null);
  };

  const switchWorkflow = (id: string) => {
    const target = workflows.find((w) => w.id === id);
    if (target) {
      setCurrentWorkflowId(id);
      setNodes(target.nodes);
      setEdges(target.edges);
      // Tắt drawer nếu đang mở để tránh nhầm dữ liệu
      setSelectedNode(null);
    }
  };
  const handleCreateNew = async () => {
    const { value: name } = await Swal.fire({
      title: "Tạo quy trình mới",
      input: "text",
      inputLabel: "Tên quy trình của bạn",
      inputPlaceholder: "Ví dụ: Auto Buff Shopee...",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
    });
    if (!name) return;

    const newId = `wf_${Date.now()}`;
    const newWf = {
      id: newId,
      name,
      nodes: initialNodes,
      edges: [],
      lastUpdated: Date.now(),
    };

    const updatedWorkflows = [...workflows, newWf];
    setWorkflows(updatedWorkflows);
    setCurrentWorkflowId(newId);
    setNodes(initialNodes);
    setEdges([]);
    localStorage.setItem("minmin_workflows", JSON.stringify(updatedWorkflows));
  };

  const handleDeleteWorkflow = async () => {
    if (!currentWorkflowId) {
      return Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn kịch bản muốn xóa!",
        confirmButtonColor: "#2563eb",
      });
    }

    const targetWf = workflows.find((w) => w.id === currentWorkflowId);

    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: `Bạn có chắc muốn xóa kịch bản "${targetWf?.name}"? Hành động này không thể hoàn tác!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // Màu đỏ cảnh báo
      cancelButtonColor: "#64748b",
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const updatedWorkflows = workflows.filter(
        (wf) => wf.id !== currentWorkflowId,
      );

      // Cập nhật State
      setWorkflows(updatedWorkflows);
      localStorage.setItem(
        "minmin_workflows",
        JSON.stringify(updatedWorkflows),
      );

      // Reset giao diện canvas về trống hoặc workflow đầu tiên
      if (updatedWorkflows.length > 0) {
        const nextWf = updatedWorkflows[0];
        setCurrentWorkflowId(nextWf.id);
        setNodes(nextWf.nodes);
        setEdges(nextWf.edges);
      } else {
        setCurrentWorkflowId(null);
        setNodes(initialNodes);
        setEdges([]);
      }

      Swal.fire({
        title: "Đã xóa!",
        text: "Kịch bản đã được loại bỏ khỏi hệ thống.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  // EXPORT: Tải file .json
  const exportToFile = () => {
    const data = { nodes, edges }; // Kiến trúc JSON bạn gửi
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `minmin_script_${Date.now()}.json`;
    link.click();
  };
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
  if (e.key === 'Delete' || e.key === 'Backspace') {
    console.log("🚀 Lệnh truy sát Edge bắt đầu...");

    // 1. Tìm xem những Edge nào đang được chọn (đang đỏ)
    setEdges((eds) => {
      const remainingEdges = eds.filter((edge) => !edge.selected);
      
      // Kiểm tra xem có thực sự xóa cái nào không
      if (remainingEdges.length !== eds.length) {
        console.log(`✅ Đã xóa ${eds.length - remainingEdges.length} đường nối!`);
      } else {
        console.warn("❌ Chẳng có Edge nào được chọn (đỏ) để xóa cả, MinMin ơi!");
      }
      
      return remainingEdges;
    });
  }
}, [setEdges]);
  
  // IMPORT: Đọc file .json và đẩy lên Canvas
  const importFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        console.log(json)
        if (json.nodes && json.edges) {
          setNodes(json.nodes);
          setEdges(json.edges);
          // Tự động fit view để thấy toàn bộ node vừa load
          
        }
      } catch (err) {
        alert("File script không đúng định dạng!");
      }
    };
    reader.readAsText(file);
  };
  const saveWorkflow = (name?: string) => {
    const newWorkflows = [...workflows];
    const index = newWorkflows.findIndex((w) => w.id === currentWorkflowId);

    const workflowData: Workflow = {
      id: currentWorkflowId || `wf_${Date.now()}`,
      name: name || newWorkflows[index]?.name || "Workflow mới",
      nodes: nodes, // State nodes của React Flow
      edges: edges, // State edges của React Flow
      lastUpdated: Date.now(),
    };

    if (index >= 0) {
      newWorkflows[index] = workflowData;
    } else {
      newWorkflows.push(workflowData);
      setCurrentWorkflowId(workflowData.id);
    }

    setWorkflows(newWorkflows);
    localStorage.setItem("minmin_workflows", JSON.stringify(newWorkflows));
  };
  const handleOpenMirror = () => {
    if (selectedDeviceId === "none") {
      return alert("Vui lòng cắm điện thoại!");
    }

    if (selectedDeviceId === "all") {
      // Nếu chọn "Tất cả", duyệt mảng devices để mở hết lên
      if (devices.length === 0) return alert("Không có thiết bị để mở!");

      devices.forEach((device) => {
        // @ts-ignore
        window.electronAPI.openMirror(device.id);
      });
    } else {
      // Nếu chọn 1 máy cụ thể, chỉ mở máy đó
      // @ts-ignore
      window.electronAPI.openMirror(selectedDeviceId);
    }
  };

  const scanAdbDevices = async () => {
    setLoadingDevices(true);
    try {
      // @ts-ignore
      const result = await window.electronAPI.getDevices();
      setDevices(result);
    } catch (error) {
      console.error("Lỗi quét thiết bị:", error);
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    scanAdbDevices();
  }, []);

  // 1. Logic thực thi & Reset
  // LOGIC THỰC THI (RUNNER)
  const runWorkflow = async () => {
    // 1. Lấy danh sách máy đang chọn từ Toolbar
    setRunningWorkflow(true);
    const targetDeviceIds =
      selectedDeviceId === "all"
        ? devices.map((d) => d.id)
        : [selectedDeviceId];

    // 2. Tìm node Start
    const startNode = nodes.find((n) => n.data.type === "start");

    if (!startNode){
        setRunningWorkflow(false);
        isStoppingRef.current =false
        return;
    };

    // 3. Duyệt từng máy (Chạy song song hoặc tuần tự)
    for (const deviceId of targetDeviceIds) {
      let currentNodeId = startNode.id;
      const visited = new Set();
      const executionVars: Record<string, string> = {};
      while (currentNodeId) {
        if (isStoppingRef.current){
            break;
        }
        if (visited.has(currentNodeId)) break;
        visited.add(currentNodeId);
        setRunningNodeId(currentNodeId);

        const node = nodes.find((n) => n.id === currentNodeId);

        if (!node) break;

        // Thực thi lệnh dựa trên data.type trong JSON của bạn
        if (node.type !== "start") {
          const { type } = node.data;

          // --- BƯỚC 1: XỬ LÝ BIẾN TRƯỚC KHI GỬI XUỐNG BACKEND ---
          // Copy params ra để không làm hỏng data gốc của Node
          let finalParams = JSON.parse(JSON.stringify(node.data));
          // Hàm thay thế {{ten_bien}} bằng giá trị thật
          const replaceVars = (str: any) => {
            if (typeof str !== "string") return str;
            return str.replace(/\{\{(.*?)\}\}/g, (_, key) => {
              return executionVars[key.trim()] || `{{${key}}}`;
            });
          };
          // Duyệt qua các field trong params để thay thế biến
          Object.keys(finalParams).forEach((key) => {
            finalParams[key] = replaceVars(finalParams[key]);
          });

          // --- BƯỚC 2: THỰC THI ---
          if (type === "set_var") {
            // Nếu là node gán biến, ta lưu vào bộ nhớ FE luôn, không cần gửi xuống BE
            executionVars[node.data.var_name] = finalParams.var_value;
            console.log(
              `[VAR] Đã gán: ${node.data.var_name} = ${finalParams.var_value}`,
            );
          } else {
            // Gửi lệnh đã được thay thế biến xuống Backend
            // @ts-ignore
            await window.electronAPI.executeAdb({
              deviceId,
              action: type,
              params: finalParams, // 🚀 Gửi params đã "nạp" giá trị biến
            });
          }

          // Delay mặc định hoặc từ params
          await new Promise((r) => setTimeout(r, node.data?.delay || 500));
        }

        // Tìm node tiếp theo qua Edges
        const edge = edges.find((e) => e.source === currentNodeId);
        currentNodeId = edge ? edge.target : null;
        if (!currentNodeId) setRunningNodeId(null);
      }
    }
    setRunningWorkflow(false);
    setRunningNodeId(null);
    isStoppingRef.current=false;
  };

  const handleReset = () => {
    if (window.confirm("Xóa sạch quy trình?")) {
      setNodes(initialNodes);
      setEdges([]);
      setSelectedNode(null);
    }
  };
  const onPaneClick = () => {
    setSelectedNode(null); // Ẩn luôn Drawer nếu cần
  };
  const handleDeleteNode = async (nodeId: string) => {
    const result = await Swal.fire({
      title: "Xóa bước này?",
      text: "Hành động này sẽ xóa bỏ bước này khỏi quy trình.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Xóa ngay",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      // Xóa node
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      // Xóa cả các dây nối (edges) liên quan đến node đó
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );

      // QUAN TRỌNG: Đóng Sidebar sau khi xóa
      setSelectedNode(null);
    }
  };
  // 2. Logic khi Click vào Node để mở Drawer
  const onNodeClick = (_event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  };
  const handleRunSingleNode = async (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || node.type === "start") return;

    // Lấy thiết bị đang chọn (hoặc thiết bị đầu tiên nếu chọn 'all')
    const deviceId =
      selectedDeviceId === "all" ? devices[0]?.id : selectedDeviceId;
    if (!deviceId) return alert("Vui lòng chọn thiết bị!");

    console.log(node);
    // Gọi xuống Electron qua Preload
    // @ts-ignore
    await window.electronAPI.executeAdb({
      deviceId,
      action: node.data.type,
      params: node.data,
    });
  };
  // 3. Logic nối dây
  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
            markerEnd: { type: "arrowclosed", color: "#3b82f6" },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  // 4. Logic Drag & Drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const dataJson = event.dataTransfer.getData("application/reactflow");
      if (!dataJson) return;

      const { nodeType, label } = JSON.parse(dataJson);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type: "actionNode",
        position,
        data: { label, type: nodeType, delay: 0 }, // Mặc định delay 0ms
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="flex flex-col h-full w-full bg-[#f8fafc] overflow-hidden relative">
      <WorkflowToolbar
        workflows={workflows}
        currentWorkflowId={currentWorkflowId}
        onSwitch={switchWorkflow}
        onSave={() => saveWorkflow()}
        isStoppingRef = {isStoppingRef}
        runningWorkflow={runningWorkflow}
        onCreate={handleCreateNew}
        onExport={exportToFile}
        onImport={importFromFile}
        onReset={handleReset}
        onRun={runWorkflow}
        onDelete={handleDeleteWorkflow}
        devices={devices}
        loadingDevices={loadingDevices}
        selectedDeviceId={selectedDeviceId}
        onDeviceChange={setSelectedDeviceId}
        onOpenMirror={handleOpenMirror}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <WorkflowSidebar />

        <div className="flex-1 relative h-full">
          <ReactFlow
            // QUAN TRỌNG: Map lại nodes để truyền trạng thái isActive
            nodes={nodes.map((n) => ({
              ...n,
              data: { ...n.data, isActive: n.id === runningNodeId },
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgesDelete={(deletedEdges) => {
              console.log("MinMin vừa tiễn biệt các kết nối:", deletedEdges);
            }} // 🚀 THÊM DÒNG NÀY ĐỂ XÓA ĐƯỢC DÂY NỐI
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onKeyDown={onKeyDown}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid={true}
            snapGrid={[25, 25]}
          >
            <Background
              color="#cbd5e1"
              variant={"dots" as any}
              gap={20}
              size={1}
            />
            <Controls className="bg-white border-none shadow-xl rounded-lg overflow-hidden" />
          </ReactFlow>
        </div>

        {selectedNode && (
          <NodePropertiesDrawer
            // Lấy dữ liệu mới nhất từ mảng nodes
            node={nodes.find((n) => n.id === selectedNode.id)}
            onClose={() => setSelectedNode(null)}
            onUpdate={setNodes}
            onOpenInspector={handleOpenXPathInspector}
            onOpenInspectorXY={handleOpenCoordsInspector}
            loadListApp={loadListApp}
            listApp={listApp}
            // TRUYỀN THÊM 2 HÀM NÀY
            onDelete={handleDeleteNode} // Hàm xóa node
            onRunSingle={handleRunSingleNode} // Hàm chạy thử node
          />
        )}
        {/* HIỂN THỊ MODAL KHI CÓ DATA */}
        {inspectorData && (
          <UIInspectorModal
            {...inspectorData}
            onClose={() => setInspectorData(null)}
            onSelectXPath={handleSelectXPath}
            onSelectXY={handleSelectXY}
          />
        )}
      </div>
    </div>
  );
};
