"use client";

import * as d3 from "d3";
import Link from "next/link";
import { Button } from "./components/ui";
import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import D3SVG from "./components/D3SVG";
import ModelInfo from "./components/ModelInfo";
import ModelSelect from "./components/ModelSelect";
import PaleoAgeInput from "./components/PaleoAgeInput";
import ProjSelect from "./components/ProjSelect";
import type { ModelList } from "./types";

ReactGA.initialize("G-SK40RD0DHH");

export default function D3MapPage() {
  const [projName, setProjName] = React.useState("Orthographic");
  const [modelName, setModelName] = React.useState("Muller2019");
  const [paleoAge, setPaleoAge] = React.useState(140);
  const [dirty, setDirty] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [modelList, setModelList] = React.useState<ModelList>({});

  useEffect(() => {
    const onResize = () => {
      setDirty(true);
    };
    window.addEventListener("resize", onResize);
    d3.json<ModelList>("https://repo.gplates.org/webdav/pmm/models.json").then(function (data) {
      if (data) setModelList(data);
    });
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const projChangeHandler = (newProjName: string) => {
    if (newProjName != projName) {
      setProjName(newProjName);
      //setDirty(true);
      setRefresh(!refresh);
    }
  };

  const modelChangeHandler = (newModelName: string) => {
    if (newModelName != modelName) {
      setModelName(newModelName);
      //setDirty(true);
      setRefresh(!refresh);
    }
  };

  const paleoAgeChangeHandler = (newAge: number) => {
    if (paleoAge != newAge) {
      setPaleoAge(newAge);
      //setDirty(true);
      setRefresh(!refresh);
    }
  };

  const handleRefreshButtonClicked = () => {
    setRefresh(!refresh);
    setDirty(false);
  };

  /**
   * download handler
   */
  const handleDownloadButtonClicked = () => {
    const svgData = document.getElementById("map-svg");
    if (!svgData) return;
    const svgString = new XMLSerializer().serializeToString(svgData);
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "paleomap.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  /*ReactGA.send({
    hitType: "pageview",
    page: "/",
    title: "Paleomap Maker",
  });*/

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
        New Paleomap Maker
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-9 svg-container">
          <D3SVG
            paleoAge={paleoAge}
            projName={projName}
            modelName={modelName}
            refresh={refresh}
          />
        </div>
        <div className="lg:col-span-3 control-container">
          <ProjSelect
            projName={projName}
            projChangeHandler={projChangeHandler}
          />
          <ModelSelect
            modelName={modelName}
            modelChangeHandler={modelChangeHandler}
          />
          <PaleoAgeInput
            paleoAge={paleoAge}
            paleoAgeChangeHandler={paleoAgeChangeHandler}
          />
          {false && (
            <Button
              disabled={!dirty}
              className="refresh-btn "
              size="sm"
              onClick={() => handleRefreshButtonClicked()}
            >
              Refresh Map
            </Button>
          )}
          {false && (
            <div
              className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
              role="alert"
            >
              <span className="font-medium">Look Here!</span>{" "}
              <span style={{ fontFamily: "emoji" }}>⚠️⚠️⚠️</span>Click the
              &quot;Refresh Map&quot; button to apply changes and redraw the map.
            </div>
          )}
          <div id="buttons-container">
            <Button
              className="download-btn"
              size="sm"
              color="blue"
              onClick={() => handleDownloadButtonClicked()}
            >
              Download
            </Button>
          </div>
        </div>
      </div>
      <ModelInfo modelName={modelName} modelList={modelList} />
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </>
  );
}
