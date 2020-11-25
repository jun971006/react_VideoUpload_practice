import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd'
import Dropzone from 'react-dropzone'
import Axios from 'axios'
import { useSelector } from 'react-redux'

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    {value:0, label: "Priavate"},
    {value:1, label: "Public"}
]

const CategoryOptions = [
    {value:0, label: "Film & Animation"},
    {value:1, label: "Autos & Vehicle"},
    {value:2, label: "Music"},
    {value:3, label: "Pets & Animals"}, 
]


export default function Videouploadpage(props) {
    const user = useSelector(state => state.user)
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")
    
    const onTitleChange = (e) => {
        //console.log(e.currentTarget.value)
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const OnDrop = (files) => {
        let formData = new FormData;
        const config = {
            header : {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])

        console.log("1"+files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName 
                    }

                    setFilePath(response.data.url)

                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if(response.data.success ){
                                console.log(response.data)

                                // 썸네일 생성 후 State로 저장해야함

                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.url)
                            }
                            else{
                                alert('썸네일 생성에 실패했습니다.')
                            }
                        })
                } else{
                    console.log(response.data.success)
                    alert('비디오 업로드 실패')
                }
            })
    }

    const onSumit = (e) => {
        // 원래는 onSubmit을 하려고 하는것을 방지하는 목적.
        e.preventDefault();

        const variable = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }

        Axios.post('/api/video/uploadVideo', variable)
            .then(response => {
                if(response.data.success){
                    //console.log(response.data)
                    // mongoDB에 업로드 성공 시 
                    // 성공 메시지 띄운 후 3초 뒤 LandingPage로 
                    message.success('성공적으로 업로드를 했습니다.')
                
                    setTimeout(() => {
                        props.history.push("/");
                    }, 3000);
                                        
                } else {
                    alert('비디오 업로드에 실패했습니다.')
                }
            })

    }

    return (
        <div style={{maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{textAlign:'center', marginBottom:'2ren'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSumit}>
                <div style={{display:'flex', justifyContent:'content-between'}}>
                    {/* Drop Zone */}
                    <Dropzone
                    onDrop={OnDrop}
                    multiple={false}
                    maxSize={1000000000}
                    >
                    {({getRootProps, getInputProps})=>(
                        <div style={{width:'300px', height:'240px', border:'1px solid lightgray', display:'flex', alignItems:'center', justifyContent:'center'}}{...getRootProps()}>
                            <input {...getInputProps()}/>
                            <Icon type="plus" style={{fontSize:'3rem'}} />

                        </div>
                    )}

                    </Dropzone>

                    {/* Thumbnail Zone */}
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail"/>
                        </div>
                    }
                    
                    
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input 
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />

                <br />
                <br />
                    <select onChange={onPrivateChange}>

                        {PrivateOptions.map((item, index) => (
                            <option key={index} value={item.value}>{item.label}</option>
                        ))}
                        
                    </select>
                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                    
                </select>
                <br />
                <br />
                <Button type="primary" sife="large" onClick={onSumit}>
                    Submit
                </Button>
            </Form>
              
        </div>
    )
}
