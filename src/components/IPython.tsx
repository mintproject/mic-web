import React, { useEffect, useState } from 'react'
import isUrl from 'validator/lib/isURL'
import { IPYTHON_API } from './environment'
import IPythonTerminal from './IPythonTerminal'

const INTERVAL_TIME = 5000 //miliseconds

enum TASK_STATUS  {
    Pending = 'PENDING',
    Success = 'SUCCESS'
}

interface FormState {
    gitRepo: string,
    modelName: string
}

function logs(id: string){
    /**
     * Return a webcomponent to show the logs using a websocket
     */
    if (id){
        return (
            <div>
                <IPythonTerminal taskId={id}/>
            </div>
        )
    }
}

const IPython = () => {
    const [gitRepo, setGitRepo] = useState('')
    const [taskId, setTaskId] = useState('')
    const [taskStatus, setTaskStatus] = useState('')
    const [loading, setLoading] = useState(false)
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(undefined)
    const [errors, setErrors] = useState<string | undefined>(undefined)

    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        /**
         * Handle input change
         */
        const {name, value} = event.target
        setGitRepo(value)
    }

    useEffect(() =>{
        /**
         * Stop the polling to the API if the task status is SUCCESS
         */
        if (taskStatus === TASK_STATUS.Success){
            clearInterval(intervalId as NodeJS.Timeout)
        }
    }, [taskStatus])

    useEffect(() => {
        /**
         * Start polling to the API to check the Status
         */
        if (taskId !== ''){
            setIntervalId(setInterval(() => {
                fetch(`http://${IPYTHON_API}/tasks/${taskId}`)
                    .then(response => response.json())
                    .then(data => {
                        setTaskStatus(data.task_status)
                    })
            }, INTERVAL_TIME))
            return () => clearInterval(intervalId as NodeJS.Timeout)
        }
    }, [taskId])

    function handleSubmit(event: React.FormEvent<EventTarget>){
        event.preventDefault()
        setLoading(true)
        setErrors(undefined)
        if (isUrl(gitRepo)) {
            const url = `http://${IPYTHON_API}/tasks`
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'url': gitRepo})
            })
            .then(response => response.json())
            .then(data => {
                setTaskId(data.task_id)
            })
        }
        else {
            setErrors("The url is not valid git url")
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input 
                    placeholder="gitRepo"
                    name="gitRepo" 
                    value={gitRepo}
                    onChange={handleChange}
                />
                <br />
                <button disabled={loading} hidden={loading}>Convert repository</button>
            </form>
            {taskId} - {taskStatus}
            {logs(taskId)}
            {errors}
        </>
    )

}

export default IPython