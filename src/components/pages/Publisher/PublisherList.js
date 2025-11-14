import { Space, Button as AntButton, Tooltip, Modal, message, Flex, Image, Switch } from 'antd';
import React, { useState, useEffect } from 'react';
import { Card, Row, CardBody, Container, Button } from "reactstrap";
import Iconify from "../../reusable/Iconify";
import { Col, } from "react-bootstrap";
import CustomTable from "../../reusable/CustomTable";
import Palette from "../../../utils/Palette";
import PublisherFormModal from './PublisherFormModal';
import Publisher from 'models/PublisherModel';
import { Link } from 'react-router-dom';
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

const PublisherList = () => {

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [selectedPublisher, setSelectedPublisher] = useState(null)
  const [openPublisherModal, setOpenPublisherModal] = useState(false)
  const [isNewRecord, setIsNewRecord] = useState(false)

  const search = useFilter((state) => state.search);
  const setSearch = useFilter((state) => state.setSearch);
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

  const columns = [
    {
      id: 'publisher_logo', label: 'Logo', filter: false, allowSort: false,
      render: ((row) => {
        return (
          <Flex style={{ height: "100px", width: "auto", aspectRatio: "3/4", alignItems: "center", justifyContent: "center" }}>
            {!row?.publisher_logo ? (
              <Iconify
                icon={"material-symbols:hide-image-outline"}
                style={{
                  fontSize: "48px"
                }}
              />
            ) : (
              <Image height={"100%"} width={"100%"} style={{ objectFit: "contain" }} src={row?.publisher_logo}></Image>
            )}
          </Flex>
        )
      })
    },
    {
      id: 'name', label: 'Name', filter: true,
    },
    // {
    //   id: 'address', label: 'Address', filter: true,
    // },
    {
      id: 'email', label: 'Email', filter: true,
    },
    {
      id: 'phone', label: 'Phone', filter: false, allowSort: false,
    },
    {
      id: 'hide', label: 'Mark as Draft', filter: true,
      render: (row) => (
        <Tooltip title="Hide data on Landing Page">
          <Switch defaultValue={row?.hide} onChange={(checked) => toggleHide(checked, row?.id)} />
        </Tooltip>
      )
    },
    {
      id: '', label: '', filter: false,
      render: ((row) => {
        return (
          <>
            <Space size="small">
              <Tooltip title="Open on Landing Page">
                <AntButton
                  type={'link'}
                  style={{ color: Palette.MAIN_THEME }}
                  onClick={() => {
                    window.open(`${Helper.redirectURL}publishers/${row?.id}`)
                  }}
                  className={"d-flex align-items-center justify-content-center"}
                  shape="circle"
                  icon={<Iconify icon={"mdi:external-link"} />} />
              </Tooltip>

              <Tooltip title="Edit">
                <Link to={`/publishers/${row.id}/edit`}>
                  <AntButton
                    type={'link'}
                    style={{ color: Palette.MAIN_THEME }}
                    onClick={() => {
                    }}
                    className={"d-flex align-items-center justify-content-center"}
                    shape="circle"
                    icon={<Iconify icon={"material-symbols:edit"} />} />
                </Link>
              </Tooltip>
              {/* <Tooltip title="Edit">
                <AntButton
                  type={'link'}
                  style={{ color: Palette.MAIN_THEME }}
                  onClick={() => {
                    setOpenPublisherModal(true)
                    setSelectedPublisher(row)
                    setIsNewRecord(false)


                  }}
                  className={"d-flex align-items-center justify-content-center"}
                  shape="circle"
                  icon={<Iconify icon={"material-symbols:edit"} />} />
              </Tooltip> */}
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
              </Tooltip>
            </Space>
          </>
        )

      })
    },
    /* {
      id: '', label: '', filter: false,
      render: ((row) => {
        return (
          <>
            <Button variant={'text'}>Lihat Detail</Button>
          </>
          )

      })
    }, */
  ]

  const deleteItem = async (id) => {
    try {
      await Publisher.delete(id)
      message.success('Publisher deleted')
      initializeData();
    } catch (e) {
      message.error('There was error from server')
      setLoading(true)
    }
  }

  const onDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this publisher data?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteItem(record)
      }
    });
  };

  const toggleHide = async (checked, id) => {
    try {
      await Publisher.edit(id, { hide: checked })
      // initializeData()
    } catch (e) {
      message.error("Error updating book")
    }
  }

  const initializeData = async (
    currentPage = page,
    currentRowsPerPage = rowsPerPage
  ) => {
    setLoading(true);
    try {
      let result = await Publisher.getAllWithPagination(
        currentRowsPerPage,
        currentPage + 1,
        search || ""
      );
      console.log(result);
      setDataSource(result.data);
      setTotalCount(result.meta.meta.total_data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    initializeData(page, rowsPerPage);
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    initializeData(0, rowsPerPage);
  }, []);

  return (
    <>
      <Container fluid>
        <Card style={{ background: Palette.BACKGROUND_DARK_GRAY, color: "white" }}
          className="card-stats mb-4 mb-xl-0">
          <CardBody>

            <Row>
              <Col className='mb-3' md={6}>
                <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>Publishers</div>
              </Col>
              <Col className='mb-3 text-right' md={6}>
                <Link to="/publishers/create">
                  <AntButton
                    onClick={() => { }}
                    size={'middle'} type={'primary'}>Add Publisher</AntButton>
                </Link>
                {/* <AntButton onClick={() => {
                  setIsNewRecord(true)
                  setOpenPublisherModal(true)
                }} size={'middle'} type={'primary'}>Add Publisher</AntButton> */}
              </Col>
            </Row>
            <Row>

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

      <PublisherFormModal
        isOpen={openPublisherModal}
        isNewRecord={isNewRecord}
        publisherData={selectedPublisher}
        close={async (refresh) => {
          if (refresh) {
            await initializeData()
          }
          setOpenPublisherModal(false)
        }}
      />

    </>
  )
}

export default PublisherList;
