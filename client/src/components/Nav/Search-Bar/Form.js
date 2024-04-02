import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import { useNavigate } from 'react-router-dom';

import './Form.css';
import { useContext } from 'react';
import { SearchContext } from '../../../Context/SearchContext';
import { useState } from "react";

import PropTypes from "prop-types";

const Form = ({Lang,model}) => {
    const [searchInput, setSearchInput] = useState('');
    const [lang, setLang] = useState('hi');

    const searchContext = useContext(SearchContext);
    const [voiceActivated, setVoiceActivated] = useState(false);
    const [recordedVoice, setRecordedVoice] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSearchInput(e.target.value);
    }

    const handleFormSubmit = (e) => {  
        e.preventDefault();
        searchContext.setSearchQuery(searchInput);
        navigate('/search');
    }
    const handleVoiceButtonClick = async () => {
        console.log("play")

        if (!voiceActivated) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video:false,
              audio: true,
            });
            const recorder = new MediaRecorder(stream);
            const chunks = [];
    
            recorder.addEventListener("dataavailable", (event) => {
              chunks.push(event.data);
            });
    
            recorder.addEventListener("stop", async () => {
              const blob = new Blob(chunks, { type: "audio/webm" });
              const reader = new FileReader();
    
              reader.onloadend = async () => {
                const base64Data = reader.result.split(",")[1];
                setRecordedVoice(base64Data);
                console.log(base64Data)
    
                // Pass the base64 code to the API endpoint
                // const requestBody = {
                //   pipelineTasks: [
                //     {
                //       taskType: "asr",
                //       config: {
                //         language: {
                //           sourceLanguage: Lang,
                //         },
                //         serviceId: "ai4bharat/conformer-hi-gpu--t4",
                //         audioFormat: "flac",
                //         samplingRate: 16000,
                //       },
                //     },
                //     {
                //       "taskType": "translation",
                //       "config": {
                //         "language": {
                //           "sourceLanguage": Lang,
                //           "targetLanguage": "en"
                //         },
                //         "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                //       }
                //     },
                
                //   ],
                //   inputData: {
                //     audio: [
                //       {
                //         audioContent: base64Data,
                //       },
                //     ],
                //   },
                // };

                const raw = JSON.stringify({
                  "pipelineTasks": [
                    {
                      "taskType": "asr",
                      "config": {
                        "language": {
                          "sourceLanguage": "hi"
                        },
                        "serviceId": "ai4bharat/conformer-hi-gpu--t4",
                        "audioFormat": "flac",
                        "samplingRate": 16000
                      }
                    },
                    {
                      "taskType": "translation",
                      "config": {
                        "language": {
                          "sourceLanguage": "hi",
                          "targetLanguage": "en"
                        },
                        "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                      }
                    }
                  ],
                  "inputData": {
                    "audio": [
                      {
                        "audioContent": base64Data
                      }
                    ]
                  }
                });
                
                console.log(raw)
                // Make the API request using the requestBody
                const response = await fetch(
                  "https://dhruva-api.bhashini.gov.in/services/inference/pipeline",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization:
                        "yBpv8lLtPZh0CaJleMk2b8l0lzqAUVHSDdgx7rVNfYJn-6_wO9pv_YDqpOj2y5cx",
                        userID:"88d299727de346108e615e167dcc158f",
                        ulcaApiKey:"44283f95b4-2cd5-4750-87ed-f18aca5b402e",
                    },
                    body: raw,
                    
                  }
                );
    
                // // Handle the API response
                // console.log("sdgsgs");
                // const data = await response.json();
                // console.log(Lang);
                // console.log("API Response:", data);
                if (!response.ok) {
                  throw new Error('Failed to fetch data');
              }
              
              const data = await response.json();
              console.log("API Response:", data);
              };
    
              reader.readAsDataURL(blob);
            });
    
            recorder.start();
            setMediaRecorder(recorder);
            setVoiceActivated(true);
          } catch (error) {
            console.error("Error recording voice:", error);
          }
        } else {
            console.log("pause")

          mediaRecorder.stop();
          setVoiceActivated(false);
        }
      };
    
    return ( 
        <>
        <form className="search__form" onSubmit={handleFormSubmit}>
            <input type="text" placeholder='Search for products' className="search__form__input" value={searchInput} onChange={handleChange} required />
            
            <button className="search__form__button" type='submit'>
                <SearchIcon fontSize='medium'/>
            </button>
            <button className="voice__button" type='button'>
                <MicIcon fontSize='medium' onClick={handleVoiceButtonClick}/>

                <select value={lang}>
                    <option value="english">English</option>
                    <option value="gujrati">Gujarati</option>
                    <option value="marathi">Marathi</option>
                </select>
            </button>

        </form>
        
        </>
    );
}

Form.propTypes = {
    Lang: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
  };
export default Form;

// import SearchIcon from '@mui/icons-material/Search';
// import MicIcon from '@mui/icons-material/Mic';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import './Form.css';
// import { useContext } from 'react';
// import { SearchContext } from '../../../Context/SearchContext';
// import { Modal, Button } from 'react-bootstrap'; // Assuming you're using react-bootstrap for the modal

// const Form = () => {
//     const [searchInput, setSearchInput] = useState('');
//     const [show, setShow] = useState(false); // State for controlling the modal visibility
//     const searchContext = useContext(SearchContext);
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setSearchInput(e.target.value);
//     }

//     const handleFormSubmit = (e) => {  
//         e.preventDefault();
//         searchContext.setSearchQuery(searchInput);
//         navigate('/search');
//     }

//     const handleShow = () => {
//         setShow(true); // Show the modal when the mic icon is clicked
//     }

//     const handleClose = () => {
//         setShow(false); // Close the modal when the close button is clicked
//     }

//     return ( 
//         <>
//         <form className="search__form" onSubmit={handleFormSubmit}>
//             <input type="text" placeholder='Search for products' className="search__form__input" value={searchInput} onChange={handleChange} required />
            
//             <button className="search__form__button" type='submit'>
//                 <SearchIcon fontSize='medium'/>
//             </button>
//             <button className="voice__button" type='button'>
//                 <MicIcon fontSize='medium' onClick={handleShow} />
//             </button>
//         </form>
//         <Modal show={show} onHide={handleClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>Modal heading</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>
//                     Close
//                 </Button>
//                 <Button variant="primary" onClick={handleClose}>
//                     Save Changes
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//         </>
//     );
// }

// export default Form;
