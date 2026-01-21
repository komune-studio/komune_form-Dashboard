import { Space, Button as AntButton, Tooltip, Modal, message, Image, Flex, Tag, Switch, Input, Select, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { Card, Row, CardBody, Container } from "reactstrap";
import { Link } from 'react-router-dom';
import Iconify from "../../reusable/Iconify";
import { Col } from "react-bootstrap";
import CustomTable from "../../reusable/CustomTable";
import Palette from "../../../utils/Palette";
import FormModel from 'models/VisitorModel';
import moment from 'moment';
import { create } from "zustand";

const { Search } = Input;

const useFilter = create((set) => ({
  search: "",
  status: "all",
  profile: "",

  setSearch: (keyword) =>
    set((state) => ({
      search: keyword,
    })),
  setStatus: (status) =>
    set((state) => ({
      status: status,
    })),
  setProfile: (profile) =>
    set((state) => ({
      profile: profile,
    })),
  resetSearch: () =>
    set((state) => ({
      search: "",
      status: "all",
      profile: ""
    })),
}));

const VisitorList = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [stats, setStats] = useState(null);

  const search = useFilter((state) => state.search);
  const status = useFilter((state) => state.status);
  const profile = useFilter((state) => state.profile);
  const setSearch = useFilter((state) => state.setSearch);
  const setStatus = useFilter((state) => state.setStatus);
  const setProfile = useFilter((state) => state.setProfile);
  const resetSearch = useFilter((state) => state.resetSearch);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleProfileChange = (value) => {
    setProfile(value);
  };

  const getProfileTagColor = (profile) => {
    switch(profile) {
      case 'Player': return 'blue';
      case 'Visitor': return 'green';
      case 'Other': return 'orange';
      default: return 'default';
    }
  };

  const columns = [
    {
      id: 'visitor_name', 
      label: 'Visitor Name', 
      filter: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.visitor_name}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>Phone: {row.phone_number}</div>
        </div>
      )
    },
    {
      id: 'visitor_profile', 
      label: 'Profile', 
      filter: true,
      render: (row) => (
        <Tag color={getProfileTagColor(row.visitor_profile)}>
          {row.visitor_profile}
          {row.visitor_profile_other && ` (${row.visitor_profile_other})`}
        </Tag>
      )
    },
    {
      id: 'filled_by', 
      label: 'Filled By', 
      filter: true,
    },
    {
      id: 'created_at', 
      label: 'Check-in', 
      filter: false,
      render: (row) => (
        <div>
          <div>{moment(row.created_at).format("DD MMM YYYY")}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {moment(row.created_at).format("HH:mm")}
          </div>
        </div>
      )
    },
    {
      id: 'checked_out_at', 
      label: 'Check-out', 
      filter: false,
      render: (row) => (
        row.checked_out_at ? (
          <div>
            <div>{moment(row.checked_out_at).format("DD MMM YYYY")}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {moment(row.checked_out_at).format("HH:mm")}
            </div>
          </div>
        ) : (
          <Tag color="red">Active</Tag>
        )
      )
    },
    {
      id: '', 
      label: 'Actions', 
      filter: false,
      render: (row) => {
        return (
          <Space size="small">
            <Tooltip title="Edit">
              <Link to={`/visitors/${row.id}/edit`}>
                <AntButton
                  type={'link'}
                  style={{ color: Palette.MAIN_THEME }}
                  className={"d-flex align-items-center justify-content-center"}
                  shape="circle"
                  icon={<Iconify icon={"material-symbols:edit"} />} 
                />
              </Link>
            </Tooltip>
            
            <Tooltip title="Quick Checkout">
              <AntButton
                type={'link'}
                style={{ color: row.checked_out_at ? '#ccc' : Palette.SUCCESS }}
                onClick={() => !row.checked_out_at && onQuickCheckout(row.id)}
                className={"d-flex align-items-center justify-content-center"}
                shape="circle"
                icon={<Iconify icon={"material-symbols:logout-rounded"} />}
                disabled={!!row.checked_out_at}
              />
            </Tooltip>

            <Tooltip title="Delete">
              <AntButton
                type={'link'}
                style={{ color: Palette.DANGER }}
                onClick={() => onDelete(row.id)}
                className={"d-flex align-items-center justify-content-center"}
                shape="circle"
                icon={<Iconify icon={"material-symbols:delete-outline"} />} 
              />
            </Tooltip>
          </Space>
        );
      }
    },
  ];

  const deleteItem = async (id) => {
    try {
      await FormModel.deleteVisitor(id);
      message.success('Visitor deleted successfully');
      initializeData();
      loadStats();
    } catch (error) {
      console.error("Error deleting visitor:", error);
      message.error('Failed to delete visitor');
    }
  };

  const onDelete = (id) => {
    Modal.confirm({
      title: "Delete Visitor",
      content: "Are you sure you want to delete this visitor?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteItem(id)
    });
  };

  const onQuickCheckout = async (id) => {
    Modal.confirm({
      title: "Checkout Visitor",
      content: "Are you sure you want to checkout this visitor?",
      okText: "Checkout",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await FormModel.checkoutVisitor(id);
          message.success('Visitor checked out successfully');
          initializeData();
          loadStats();
        } catch (error) {
          console.error("Error checking out visitor:", error);
          message.error('Failed to checkout visitor');
        }
      }
    });
  };

  const initializeData = async (
    currentPage = page,
    currentRowsPerPage = rowsPerPage
  ) => {
    setLoading(true);
    try {
      const filters = {};
      
      if (search) filters.search = search;
      if (status !== "all") {
        filters.includeCheckedOut = status === "checked-out";
      }
      if (profile) {
        filters.visitorProfile = profile;
      }
      
      const result = await FormModel.getAllVisitors(filters);
      
      if (result && result.http_code === 200) {
        // Implement pagination on frontend since API doesn't have pagination
        const allData = result.data || [];
        const startIndex = currentPage * currentRowsPerPage;
        const endIndex = startIndex + currentRowsPerPage;
        const paginatedData = allData.slice(startIndex, endIndex);
        
        setDataSource(paginatedData);
        setTotalCount(allData.length);
      } else {
        setDataSource([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
      setDataSource([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsResult = await FormModel.getVisitorStats();
      if (statsResult && statsResult.http_code === 200) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const exportToCSV = () => {
    try {
      const csvData = FormModel.exportVisitorsToCSV(dataSource);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visitors_${moment().format('YYYYMMDD_HHmmss')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      message.success('Exported to CSV successfully');
    } catch (error) {
      console.error("Error exporting CSV:", error);
      message.error('Failed to export CSV');
    }
  };

  useEffect(() => {
    initializeData(page, rowsPerPage);
  }, [page, rowsPerPage, search, status, profile]);

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <>
      <Container fluid>
        <Card style={{ background: Palette.BACKGROUND_DARK_GRAY, color: "white" }}
          className="card-stats mb-4 mb-xl-0">
          <CardBody>
            <Row>
              <Col className='mb-3' md={6}>
                <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>Visitors Management</div>
              </Col>
              <Col className='mb-3 text-right' md={6}>
                <Space>
                  <Button 
                    type="default"
                    onClick={exportToCSV}
                    icon={<Iconify icon={"material-symbols:download"} />}
                  >
                    Export CSV
                  </Button>
                  <Link to="/visitors/create">
                    <AntButton
                      size={'middle'} 
                      type={'primary'}
                      icon={<Iconify icon={"material-symbols:add"} />}
                    >
                      Add Visitor
                    </AntButton>
                  </Link>
                </Space>
              </Col>
            </Row>

            {/* Stats Row */}
            {stats && (
              <Row style={{ marginBottom: 24 }}>
                <Col md={3}>
                  <Card style={{ background: Palette.MAIN_THEME, color: "white" }}>
                    <CardBody>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>Total Visitors</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalVisitors || 0}</div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card style={{ background: Palette.SUCCESS, color: "white" }}>
                    <CardBody>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>Active Now</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.activeVisitors || 0}</div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card style={{ background: Palette.INFO, color: "white" }}>
                    <CardBody>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>Checked Out</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.checkedOutCount || 0}</div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card style={{ background: Palette.WARNING, color: "white" }}>
                    <CardBody>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>Today</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {dataSource.filter(v => 
                          moment(v.created_at).isSame(moment(), 'day')
                        ).length}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Filter Row */}
            <Row style={{ marginBottom: 24 }}>
              <Col md={4}>
                <Search
                  placeholder="Search by name, phone, or staff"
                  onSearch={handleSearch}
                  enterButton
                  style={{ marginBottom: 16 }}
                />
              </Col>
              <Col md={4}>
                <Select
                  placeholder="Filter by status"
                  style={{ width: '100%' }}
                  value={status}
                  onChange={handleStatusChange}
                >
                  <Select.Option value="all">All Visitors</Select.Option>
                  <Select.Option value="active">Active Only</Select.Option>
                  <Select.Option value="checked-out">Checked Out Only</Select.Option>
                </Select>
              </Col>
              <Col md={4}>
                <Select
                  placeholder="Filter by profile"
                  style={{ width: '100%' }}
                  value={profile}
                  onChange={handleProfileChange}
                >
                  <Select.Option value="">All Profiles</Select.Option>
                  <Select.Option value="Player">Player</Select.Option>
                  <Select.Option value="Visitor">Visitor</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Col>
            </Row>

            {/* Table */}
            <Row>
              <Col md={12}>
                <CustomTable
                  showFilter={true}
                  pagination={true}
                  searchText={search}
                  data={dataSource}
                  columns={columns}
                  defaultOrder={"created_at"}
                  onSearch={handleSearch}
                  apiPagination={false} // Using frontend pagination
                  totalCount={totalCount}
                  currentPage={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  loading={loading}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
}

export default VisitorList;