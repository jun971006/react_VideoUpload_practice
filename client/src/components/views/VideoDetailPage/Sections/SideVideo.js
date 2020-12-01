import React, { useEffect, useState } from "react";
import Axios from "axios";

export default function Sidevideo(props) {
    // react.hook을 사용해서 mongodb에 접근해서 video정보 다 가져오기

    const [SideVideos, setSideVideos] = useState([]);

    useEffect(() => {
        Axios.get("/api/video/getVideos").then((response) => {
            if (response.data.success) {
                //console.log(response.data.videos)
                setSideVideos(response.data.videos);
                //console.log(SideVideos)
            } else {
                alert("비디오 가져오기 실패했습니다.");
            }
        });
    }, []);

    const renderSideVideo = SideVideos.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return (
            <div
                key={index}
                style={{
                    display: "flex",
                    marginBottom: "1rem",
                    padding: "0 2rem",
                }}
            >
                <div style={{ width: "40%", marginRight: "1rem" }}>
                    <a href>
                        {/* 썸네일 이미지를 가져오려고 하는것 */}
                        <img
                            style={{ width: "100%", height:'100%' }}
                            src={`http://localhost:5000/${video.thumbnail}`}
                            alt="thumbnail"
                        />
                    </a>
                </div>

                <div style={{ width: "50%" }}>
                    <a href style={{ color: 'gray'}}>
                        {/* video모델 값을 mongoDB에서 가져온 후 보여주기 */}
                        <span style={{ fontSize: "1rem", color: "black" }}>
                            {video.title}
                        </span>
                        <br />
                        <span>{video.writer.name}</span>
                        <br />
                        <span>{video.views} views</span>
                        <br />
                        <span>
                            {minutes} : {seconds}
                        </span>
                    </a>
                </div>
            </div>
        );
    });

    return (
        // 이게 사이드 비디오에서 하나의 카드 양식임.. 따라서 SideVideos를 map으로 뿌려줘야 한다.

        <React.Fragment>{renderSideVideo}</React.Fragment>
    );
}
