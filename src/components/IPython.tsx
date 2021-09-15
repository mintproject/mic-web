import React, { useEffect, useState } from 'react'
const IPython = () => {
    const [gitRepo, setGitRepo] = useState('')
    const [taskId, setTaskId] = useState('')
    const [taskStatus, setTaskStatus] = useState('')
    const [loading, setLoading] = useState(false)
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(undefined)
    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        setGitRepo(value)
    }

    useEffect(() =>{
        if (taskStatus === "SUCCESS"){
            clearInterval(intervalId as NodeJS.Timeout)
        }
    }, [taskStatus])

    useEffect(() => {
        if (taskId !== ''){
            setIntervalId(setInterval(() => {
                fetch(`http://localhost:8004/tasks/${taskId}`)
                    .then(response => response.json())
                    .then(data => {
                        setTaskStatus(data.task_status)
                    })
            }, 1000))
            return () => clearInterval(intervalId as NodeJS.Timeout)
        }
    }, [taskId])

    function handleSubmit(event: React.FormEvent<EventTarget>){
        event.preventDefault()
        setLoading(true)
        const url = 'http://localhost:8004/tasks'
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
                <button disabled={loading}>Add contact</button>
            </form>
            {taskId} - {taskStatus}
        </>
    )

}

export default IPython