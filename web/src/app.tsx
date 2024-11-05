import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./i18n";

import Map from "react-map-gl";
import area from "@turf/area";

import { TreeType, CalculateBiomass } from "./api.js";

import dbhImg from "../pubilc/img/dbh.png";
import mapImg from "../pubilc/img/map.png";

import DrawControl from "./draw-control";
// import ControlPanel from "./control-panel";

const TOKEN =
  "pk.eyJ1IjoiZHVja3BpbmsiLCJhIjoiY2x6dG1ndG5kMXd6azJrb2dnODBqMXFtbCJ9.AAhAWU_almuAvO7KVErPrQ";

const languages = [
  { value: "", text: "Options" },
  { value: "vi", text: "Tiếng Việt" },
  { value: "en", text: "English" },
];

export default function App() {
  const { t } = useTranslation();
  const [lang, setLang] = useState("");
  const [dataTreeType, setDataTreeType] = useState([]);

  const [loading, setLoading] = useState(false);

  const [features, setFeatures] = useState({});

  const [type, setType] = useState();
  const [dbh, setDbh] = useState();
  const [number, setNumber] = useState();
  const [areaNumber, setAreaNumber] = useState();
  const [wbd, setWbd] = useState(100);
  const [result, setResult] = useState();
  const [currency, setCurrency] = useState();

  const [showDbh, setShowDbh] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleCloseDbh = () => setShowDbh(false);
  const handleShowDbh = () => setShowDbh(true);
  const handleCloseMap = () => setShowMap(false);
  const handleShowMap = () => setShowMap(true);

  const onUpdate = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  const handleChange = (e) => {
    setLang(e.target.value);
    const baseUrl = window.location.origin;
    window.location.replace(baseUrl + "?lng=" + e.target.value);
  };

  let polygonArea = 0;
  for (const polygon of Object.values(features)) {
    polygonArea += area(polygon);
  }

  useEffect(() => {
    setAreaNumber(Math.round(polygonArea / 3));
  }, [polygonArea]);

  const Calculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await CalculateBiomass(type, dbh, number, areaNumber, wbd);
    setResult(new Intl.NumberFormat(["ban", "id"]).format(res.result));
    setCurrency(res.money);
    console.log(res);
    setLoading(false);
  };

  useEffect(() => {
    const getDataTreeType = async () => {
      const res = await TreeType();
      setDataTreeType(res);
    };

    getDataTreeType();
  }, []);

  useEffect(() => {
    if (dataTreeType.length > 0) {
      setType(dataTreeType[0].type);
    }
  }, [dataTreeType]);

  // console.log(dataTreeType);
  // console.log(longitude, latitude, type, dbh, number, areaNumber);
  console.log(type, dbh, number, areaNumber, wbd);

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          <Modal show={showDbh} onHide={handleCloseDbh} centered>
            <Modal.Header closeButton>
              <Modal.Title>{t("modalDbh")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img
                src={dbhImg}
                style={{
                  width: "100%",
                }}
              />
            </Modal.Body>
          </Modal>

          <Modal show={showMap} onHide={handleCloseMap} centered>
            <Modal.Header closeButton>
              <Modal.Title>{t("modalMap")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img
                src={mapImg}
                style={{
                  width: "100%",
                }}
              />
            </Modal.Body>
          </Modal>

          <div
            className="px-4 border-bottom d-flex align-items-center justify-content-start"
            style={{ height: "10vh" }}
          >
            <img
              alt="Công viên cây xanh logo - a leaf inside a circle with the words Công viên cây xanh below"
              src="https://i.ibb.co/RD7rQq4/LOGO.png"
              className="img-fluid"
              style={{
                height: "80%",
              }}
            />
            <div className="col title-hidden">
              <h3 className="fs-5 fw-bold">Vcarbon Map</h3>
              <h3 className="fs-6">View live information of trees</h3>
            </div>
            <select value={lang} onChange={handleChange}>
              {languages.map((item) => {
                return (
                  <option key={item.value} value={item.value}>
                    {item.text}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="">
            <div className="d-flex" style={{ height: "90vh" }}>
              <form className="col p-3 bg-light">
                <label className="form-label">{t("tree")}</label>
                <select
                  className="form-select mb-2"
                  aria-label="Default select example"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {dataTreeType.map((treeType) => (
                    <option key={treeType.name} value={treeType.type}>
                      {treeType.name}
                    </option>
                  ))}
                </select>
                <div className="mb-2">
                  <label className="form-label">{t("dbh")} (m)</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={dbh}
                      onChange={(e) => setDbh(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={handleShowDbh}
                    >
                      ?
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label">{t("number")} / 10m2</label>
                  <input
                    type="text"
                    className="form-control"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">{t("wbd")} (kg/m3)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={wbd}
                    onChange={(e) => setWbd(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">{t("area")} (m2)</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={areaNumber}
                      onChange={(e) => setAreaNumber(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={handleShowMap}
                    >
                      ?
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mb-2 w-100"
                  onClick={Calculate}
                >
                  {t("cal")}
                </button>
                <div className="mb-2">
                  <label className="form-label">{t("res")}</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={result}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">{t("currency")}</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={currency}
                  />
                </div>
                {/* <select value={lang} onChange={handleChange}>
                  {languages.map((item) => {
                    return (
                      <option key={item.value} value={item.value}>
                        {item.text}
                      </option>
                    );
                  })}
                </select> */}
              </form>
              <div className="col-9 map-hidden">
                <Map
                  initialViewState={{
                    longitude: 108.117295,
                    latitude: 16.127795,
                    zoom: 18,
                  }}
                  mapStyle="mapbox://styles/mapbox/satellite-v9"
                  mapboxAccessToken={TOKEN}
                >
                  <DrawControl
                    position="top-left"
                    displayControlsDefault={false}
                    controls={{
                      polygon: true,
                      trash: true,
                    }}
                    defaultMode="draw_polygon"
                    onCreate={onUpdate}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                </Map>
                {/* <ControlPanel polygons={Object.values(features)} /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
