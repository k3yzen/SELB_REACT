import React, { Fragment, useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { del, get, set, update } from 'idb-keyval'
import { useAlert } from 'react-alert'
import axios from 'axios'
export default function HomePage() {

    const alert = useAlert()

    const [username, setUsername] = useState("")
    const [savedTejasTests, setSavedTejasTests] = useState([])
    const [savedCalculoTests, setSavedCalculoTests] = useState([])
    const [tejasLength, setTejasLength] = useState(undefined)
    const [savedTests, setSavedTests] = useState(false)
    const [calculoLength, setCalculoLength] = useState(undefined)
    const [mode, setMode] = useState('online')


    useEffect(() => {

        get('userData').then(res => {
            setUsername(res.name)
        })
    
        get('completedTests')
        .then(res => {
            let tejas = 0;
            let calculo = 0;

            res.forEach(element => {
                if (element[0]['instrument'] === 1) {
                    tejas++
                    setSavedTests(true)
                }
                if (element[0]['instrument'] === 2) {
                    calculo++
                    setSavedTests(true)
                }
            })

            setSavedTejasTests(tejas)
            setSavedCalculoTests(calculo)
            
        })

        setTimeout(() => {
            get('tejasLength')
            .then(res => {
                setTejasLength(res)
    
            })

            get('calculoLength')
            .then(res => {
                setCalculoLength(res)
            })
        }, 1000)





  

       
        
        
    }, [])


    
    savedTejasTests === undefined ? console.log("Ta indefinido", savedTejasTests) : console.log("Ta definido", savedTejasTests, savedTejasTests.length)

    function sendNewInstrument() {

        get('completedTests')
        .then(
            res => {
                axios({
                    method: 'post',
                    url:  'http://localhost:3500/newevaluation'||'https://selb.bond/newevaluation',
                    data: res
                });
            }
        )
        .then(
            _ => {
                update('completedTests', val => [])
                setTimeout(() => {

                    window.location.pathname = '/'
                }, 1000)
            }
        )

        alert.show(`Haz enviado ${savedTejasTests+savedCalculoTests} test`);
        


        
    }

    return (
        <Fragment>

        <div className="home-wrapper">
           <h1>Hola {username}!</h1>


           <div className="table-wrapper">
           <div className="sendEvaluationTable">
           <h4>Evaluaciones por enviar</h4>

                <table className="table table-home">

                    <thead className="thead-dark">
                        <tr>
                        <th scope="col">Instrumento</th>
                        <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">Tejas Lee</th>
                        <td>{savedTejasTests && savedTejasTests >= 0 ? savedTejasTests : 0}</td>
                        </tr>
                        <tr>
                        <th scope="row">Cálculo</th>
                        <td>{savedCalculoTests && savedCalculoTests >= 0 ? savedCalculoTests : 0}</td>
                        </tr>

                    </tbody>
                    </table>

                    { navigator.onLine ? <Fragment>
                            {savedTests === true?<button onClick={sendNewInstrument} className="button btn btn-primary">Enviar</button> : <button className="button btn btn-secondary" disabled>Enviar</button>}
                        </Fragment> : <button className="button btn btn-secondary" disabled>Enviar</button> }

             
           </div>

           <div className="instrumentInfoTable">
                <h4>Evaluaciones por Instrumento</h4>
                <table className="table table-home">
        
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col">Instrumento</th>
                        <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">Tejas Lee</th>
                        <td>{tejasLength && tejasLength >= 0 ? tejasLength : 0}</td>

                        </tr>
                
                        <tr>
                        <th scope="row">Cálculo</th>
                        <td>{calculoLength && calculoLength >= 0 ? calculoLength : 0}</td>

                        </tr>

                    </tbody>
                    </table>
            </div>
           </div>



           </div>
          
           



        </Fragment>

    )
}
