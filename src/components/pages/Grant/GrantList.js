import { Space, Button as AntButton, Tooltip, Modal, message, Image, Flex, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { Card, Row, CardBody, Container } from "reactstrap";
import { Link } from 'react-router-dom';
import Iconify from "../../reusable/Iconify";
import { Col } from "react-bootstrap";
import CustomTable from "../../reusable/CustomTable";
import Palette from "../../../utils/Palette";
import Grant from 'models/GrantModel';
import GrantReviewModal from './GrantReviewModal';
import moment from 'moment';
import Helper from 'utils/Helper';
import { create } from "zustand";

const useFilter = create((set) => ({
  search: "",

  setSearch: (keyword) =>
    set((state) => ({
      search: keyword,
    })),
  resetSearch: () =>
    set((state) => ({
      search: "",
    })),
}));

const tabs = [
  {
    key: 'PENDING',
    label: 'Pending',
  },
  {
    key: 'NOT_PENDING',
    label: 'Completed',
  },
];

const GrantList = () => {

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [selectedGrant, setSelectedGrant] = useState(null)
  const [openGrantModal, setOpenGrantModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState("PENDING");
  const search = useFilter((state) => state.search);
  const setSearch = useFilter((state) => state.setSearch);
  const resetSearch = useFilter((state) => state.resetSearch);

  const resetAllFilters = () => {
    resetSearch();
    setPage(0);
  };

  const handleTabChange = (key) => {
    resetAllFilters();
    setSelectedTab(key); 
  };

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

    const approveGrant = async (id) => {
    try {
      await Grant.approveGrant(id)
      message.success('Grant approved')
      initializeData();
      setOpenGrantModal(false);
    } catch (e) {
      message.error('There was error from server')
      setLoading(true)
    }
  }

  const rejectGrant = async (id, reject_reason) => {
    try {
      await Grant.rejectGrant(id, { reject_reason })
      message.success('Grant rejected')
      initializeData();
      setOpenGrantModal(false);
    } catch (e) {
      message.error('There was error from server')
      setLoading(true)
    }
  }

  const columns = [
    {
      id: 'id', label: 'ID', filter: true,
    },
    {
      id: 'book_title', label: 'Book Title', filter: true,
    },
    {
      id: 'target_language', label: 'Target Language', filter: true,
    },
    {
      id: "applicants_name", label: "Applicants Name", filter: true,
      render: (row) => Helper.toTitleCase(row?.members.first_name + " " + row?.members.last_name)
    },
    {
      id: 'created_at', label: 'Created At', filter: true,
      render: (row) => moment(row?.created_at).format("DD MMMM YYYY")
    },
    {
      id: 'status', label: 'Status', filter: true,
      render: (row) =>
        <span className={`font-weight-bold
          ${row?.status === "WAITING" ? "text-white" :
            row?.status === "APPROVED" ? "text-success" :
              row?.status === "REJECTED" ? "text-danger" : ""
          }
        `}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
          {row?.status}
          {" "}
          {
            row?.status === "WAITING" ? (
              <Iconify icon={'mdi:clock-time-seven-outline'} width={20} height={20} />
            ) : row?.status === "APPROVED" ? (
              <Iconify icon={'mdi:check'} width={20} height={20} />
            ) : row?.status === "REJECTED" ? (
              <Iconify icon={'mdi:close'} width={20} height={20} />
            ) : (
              <></>
            )
          }
        </span>
    },
    {
      id: '', label: '', filter: false,
      render: ((row) => {
        return (
          <>
            <Space size="small">
              <AntButton
                type={'link'}
                style={{ color: Palette.MAIN_THEME }}
                onClick={() => {
                  setSelectedGrant(row)
                  setOpenGrantModal(true)
                }}
                className={"d-flex align-items-center justify-content-center text-white"}
                shape="circle"
                icon={<Iconify icon={"mdi:print-preview"} />} >
                Review
              </AntButton>
              {/* Tombol Detail */}
              {/* <Tooltip title="Detail">
                <AntButton
                  type={'link'}
                  style={{ color: Palette.MAIN_THEME }}
                  onClick={() => {
                    setOpenGrantModal(true)
                    setSelectedGrant(row)
                  }}
                  className={"d-flex align-items-center justify-content-center"}
                  shape="circle"
                  icon={<Iconify icon={"material-symbols:search-rounded"} />} />
              </Tooltip> */}

              {/* <Tooltip title="Edit">
                <Link to={`/authors/${row.id}/edit`}>
                  <AntButton
                    type={'link'}
                    style={{ color: Palette.MAIN_THEME }}
                    className={"d-flex align-items-center justify-content-center"}
                    shape="circle"
                    icon={<Iconify icon={"material-symbols:edit"} />} />
                </Link>
              </Tooltip>
              <Tooltip title="Delete">
                <AntButton
                  type={'link'}
                  style={{ color: Palette.MAIN_THEME }}
                  onClick={() => {
                    onDelete(row.id)
                  }}
                  className={"d-flex align-items-center justify-content-center"}
                  shape="circle"
                  icon={<Iconify icon={"material-symbols:delete-outline"} />} />
              </Tooltip> */}
            </Space >
          </>
        )

      })
    },
  ] 



  // const onApprove = (record) => {
  //   Modal.confirm({
  //     title: "Are you sure you want to approve this grant request?",
  //     okText: "Yes",
  //     okType: "text",
  //     onOk: () => {
  //       approveGrant(record.id)
  //     },
  //     okButtonProps: {
  //       className: "bg-success"
  //     },
  //     cancelButtonProps: {
  //       type: "text",
  //       className: "bg-white"
  //     }
  //   });
  // }

  // const onDelete = (record) => {
  //   Modal.confirm({
  //     title: "Are you sure you want to reject this grant request?",
  //     okText: "Yes",
  //     okType: "text",
  //     onOk: () => {
  //       rejectGrant(record.id)
  //     },
  //     okButtonProps: {
  //       className: "bg-danger"
  //     },
  //     cancelButtonProps: {
  //       type: "text",
  //       className: "bg-white"
  //     }
  //   });
  // };

  const initializeData = async (currentPage = page, currentRowsPerPage = rowsPerPage) => {
    setLoading(true);
    try {
      let result = await Grant.searchByStatusAndPagination(
        search || "",
        currentRowsPerPage,
        currentPage + 1,
        selectedTab,
      );
      setDataSource(result.data);
      setTotalCount(result.meta.pagination.total);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    initializeData(page, rowsPerPage);
  }, [page, rowsPerPage, search, selectedTab]);

  useEffect(() => {
    initializeData(0, rowsPerPage)
  }, [])

  return (
    <>
      <Container fluid>
        <Card style={{ background: Palette.BACKGROUND_DARK_GRAY, color: "white" }}
          className="card-stats mb-4 mb-xl-0">
          <CardBody>

            <Row>
              <Col className='mb-3' md={6}>
                <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>Translation Grants</div>
              </Col>
              {/* <Col className='mb-3 text-right' md={6}>
                <Link to="/authors/create">
                  <AntButton
                    onClick={() => { }}
                    size={'middle'} type={'primary'}>Add Author</AntButton>
                </Link>
              </Col> */}
            </Row>
            <Row>
              <Col>
                <Tabs defaultActiveKey='pending' items={tabs} onChange={handleTabChange} />
              </Col>
            </Row>
            <CustomTable
              showFilter={true}
              pagination={true}
              searchText={search}
              data={dataSource}
              columns={columns}
              defaultOrder={"created_at"}
              onSearch={handleSearch}
              apiPagination={true}
              totalCount={totalCount}
              currentPage={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </CardBody>
        </Card>

      </Container>

      {/* Modal untuk Detail Author */}
      <GrantReviewModal
        open={openGrantModal}
        grant={selectedGrant}
        onApprove={approveGrant}
        onReject={rejectGrant}
        onClose={() => setOpenGrantModal(false)}
      />
    </>
  )
}

export default GrantList;