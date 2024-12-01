import React, { useState, useEffect, ChangeEvent } from "react";
import { Button, Input, Table, Modal, Select, Popover } from "antd";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { API } from "../../hook/useEnv";
import { EditOutlined, MoreOutlined } from "@ant-design/icons";
import { DeleteIcon, File } from "../../assets/images/Icons";

interface Organization {
  id: number;
  title: string;
  course: string;
  attachment?: {
    size: number;
    url: string;
    origName: string;
  };
}

const Dashboard: React.FC = () => {
  const data = localStorage.getItem("token");
  const token = data ? JSON.parse(data) : "";
  const [refresh, setRefresh] = useState<boolean>(false);

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");

  const [courseId, setCourseId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [size, setSize] = useState<number>(0);
  const [url, setUrl] = useState<string>("");
  const [origName, setOrigName] = useState<string>("");

  const [isEdit, setIsEdit] = useState(false);
  const [currentContract, setCurrentContract] = useState<Organization | null>(null);

  const [courses, setCourses] = useState<{ label: string; value: number }[]>([]);


  function handleChooseFile(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files[0]) {
      setSize(files[0].size);
      setUrl(files[0].type);
      setOrigName(files[0].name);
    }
  }

  // add part 
  function handleAddCourse() {
    const requestData = { title, courseId, attachment: { size, url, origName } };

    axios
      .post(`${API}/api/staff/contracts/create`, requestData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      .then(() => {
        setRefresh(!refresh);
        resetForm();
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.error("Xatolik:", err.response?.data || err.message);
        alert("Xato bor!");
      });
  }
  // add part 



  // update part 
  function handleEditContract(contract: Organization) {
    setTitle(contract.title || "");
    setCourseId(contract.course ? parseInt(contract.course) : 0);
    setSize(contract.attachment?.size || 0);
    setUrl(contract.attachment?.url || "");
    setOrigName(contract.attachment?.origName || "");
    setCurrentContract(contract);
    setIsEdit(true);
    setIsModalOpen(true);
  }

  function handleUpdateContract() {
    if (!currentContract) return;

    const updatedData = { title, courseId, attachment: { size, url, origName } };

    axios.put(`${API}/api/staff/contracts/${currentContract.id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(() => {
        setRefresh(!refresh);
        resetForm();
        setIsModalOpen(false);
        setIsEdit(false);
      })
      .catch((err) => {
        console.error("Error:", err.response?.data || err.message);
        alert("Error occurred while updating the contract!");
      });
  }

  function resetForm() {
    setTitle("");
    setCourseId(0);
    setSize(0);
    setUrl("");
    setOrigName("");
    setCurrentContract(null);
  }
  // update part 


  // table part 
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "id",
    },
    {
      title: "Nomi",
      dataIndex: "title",
      key: "name",
    },
    {
      title: "Kurs",
      dataIndex: "course",
      key: "course",
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: Organization) => (
        <Popover
          content={
            <div className="space-y-2">
              <button className="flex items-center space-x-2" onClick={() => handleEditContract(record)}>
                <EditOutlined />
                <span>Edit</span>
              </button>
            </div>
          }>
          <button>
            <MoreOutlined className="scale-[1.2]" />
          </button>
        </Popover>
      ),
    },
  ];
  // table part 


  // Courses Get All
  useEffect(() => {
    axios.get(`${API}/api/staff/courses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCourses(
          res.data.data.courses.map((item: any) => ({
            label: item.name,
            value: item.id,
          }))
        );
      });
  }, [token]);
  // Courses Get All


  // Course Get all start
  useEffect(() => {
    axios.get(`${API}/api/staff/contracts/all`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { search: searchText },
    })
      .then((res) => {
        setOrganizations(
          res.data.data.contracts.map((item: any, index: number) => ({
            id: item.id,
            key: index + 1,
            title: item.title,
            course: item.course?.name || "Noma'lum",
            attachment: item.attachment || {},
          }))
        );
      })
      .catch((err) => console.error("Error:", err.response?.data || err.message));
  }, [searchText, refresh, token]);
  // Course Get all end

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mb-4 flex justify-between items-center">
        <Input placeholder="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: "300px" }} />
        <Button type="primary" onClick={() => setIsModalOpen(true)} className="ant-button">Qo‘shish</Button>
      </div>
      <Table columns={columns} dataSource={organizations} rowKey="id" pagination={{ pageSize: 10 }} />
      <Modal
        title={isEdit ? "Shartnoma o'zgartirish" : "Shartnoma yaratish"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" className="ant-cancel" onClick={() => setIsModalOpen(false)}>Bekor qilish</Button>,
          <Button key="submit" type="primary" className="ant-button" onClick={isEdit ? handleUpdateContract : handleAddCourse}>
            {isEdit ? "O'zgartirish" : "Saqlash"}
          </Button>,
        ]}>
        <strong className="mb-[8px] block mt-8">Kurs *</strong>
        <Select
          className="w-full mb-4"
          size="large"
          showSearch
          placeholder="Select a course"
          optionFilterProp="label"
          options={courses}
          onChange={(value) => setCourseId(value)} />
        <strong className="mb-[8px] block mt-[32px]">Nomi *</strong>
        <Input required onChange={(e) => setTitle(e.target.value)} size="large" placeholder="Nom kiriting" value={title} />
        <div className="w-full border p-4 mt-4 text-center flex items-center justify-center rounded-md">
          <label className="flex items-center justify-center cursor-pointer">
            <File />
            <input type="file" className="hidden" onChange={handleChooseFile} />
            <span className="text-[#0EB182]">{origName || "Fayl biriktiring"}</span>
          </label>
          {origName && (
            <button onClick={() => setOrigName("")} className="ml-2"><DeleteIcon /></button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
