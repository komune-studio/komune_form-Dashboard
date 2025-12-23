import { Space, Button as AntButton, Tooltip, Modal, message, Image, Flex, Tag, Switch } from 'antd';
import React, { useState, useEffect } from 'react';
import { Card, Row, CardBody, Container } from "reactstrap";
import { Link } from 'react-router-dom';
import Iconify from "../../reusable/Iconify";
import { Col, } from "react-bootstrap";
import CustomTable from "../../reusable/CustomTable";
import Palette from "../../../utils/Palette";
import News from 'models/NewsModel';
import EBulletin from 'models/EBulletinModel';
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

const EBulletinList = () => {

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null)
  const [selectedEBulletin, setSelectedEBulletin] = useState(null)
  const [openNewsModal, setOpenNewsModal] = useState(false)
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
    // {
    //   id: 'image_cover', label: 'Cover Image', filter: false, allowSort: false,
    //   render: (row) => {
    //     return (
    //       <Flex style={{ height: "100px", width: "auto", aspectRatio: "3/4", alignItems: "center", justifyContent: "center" }}>
    //         {!row?.image_cover ? (
    //           <Iconify
    //             icon={"material-symbols:hide-image-outline"}
    //             style={{
    //               fontSize: "48px"
    //             }}
    //           />
    //         ) : (
    //           <Image height={"100%"} width={"100%"} style={{ objectFit: "contain" }} src={row?.image_cover}></Image>
    //         )}
    //       </Flex>
    //     )
    //   }
    // },
    {
      id: 'name', label: 'Name', filter: true,
    },
    {
      id: 'created_at', label: 'Created At', filter: false,
      render: (row) => {
        return (
          moment(row.created_at).format("DD MMM YYYY HH:mm")
        )
      }
    },
    // {
    //   id: 'hide', label: 'Mark as Draft', filter: true,
    //   render: (row) => (
    //     <Tooltip title="Hide data on Landing Page">
    //       <Switch defaultValue={row?.hide} onChange={(checked) => toggleField("hide", checked, row?.id)} />
    //     </Tooltip>
    //   )
    // },
    {
      id: '', label: '', filter: false,
      render: ((row) => {
        return (
          <>
            <Space size="small">

              {/* <Tooltip title="Detail">
                <Link to={`/books/${row.id}`}>
                  <AntButton
                    type={'link'}
                    style={{ color: Palette.MAIN_THEME }}
                    onClick={() => {
                      setOpenNewsModal(true)
                      setSelectedNews(row)
                      setIsNewRecord(false)
                    }}
                    className={"d-flex align-items-center justify-content-center"}
                    shape="circle"
                    icon={<Iconify icon={"material-symbols:search-rounded"} />} />
                </Link>
              </Tooltip> */}
              <Tooltip title="Edit">
                <Link to={`/e-bulletin/${row.id}/edit`}>
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
      await EBulletin.delete(id)
      message.success('E-Bulletin deleted')
      initializeData();
    } catch (e) {
      message.error('There was error from server')
      setLoading(true)
    }
  }

  const onDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this E-Bulletin data?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteItem(record)
      }
    });
  };

  const toggleField = async (field, checked, id) => {
    try {
      await News.edit(id, { [field]: checked });
      // initializeData();
    } catch (e) {
      message.error(`Error updating news ${field}`);
    }
  };

  // Need to use EBulletin.getAllWithPagination (Create new API if doesn't exist)
  const initializeData = async (
    currentPage = page,
    currentRowsPerPage = rowsPerPage
  ) => {
    setLoading(true);
    try {
      let result = await News.getAllWithPagination(
        currentRowsPerPage,
        currentPage + 1,
        search || ""
      );
      setDataSource(result.data);
      setTotalCount(result.meta.meta.total_data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

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
                <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>News</div>
              </Col>
              <Col className='mb-3 text-right' md={6}>
                <Link to="/e-bulletins/create">
                  <AntButton
                    onClick={() => { }}
                    size={'middle'} type={'primary'}>Add E Bulletin</AntButton>
                </Link>
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

    </>
  )
}

export default EBulletinList;
