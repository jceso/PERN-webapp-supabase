import React, { Fragment, useState } from 'react';

const InputTodo = () => {
    const [description, setDescription] = useState("Description");

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { task: description };
            const response = await fetch("http://localhost:5000/todo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            console.log(response);
        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <Fragment>
            <h1>PERN Input Todo</h1>
            <form onSubmit={onSubmitForm}>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)}/>
                <button>Add</button>
            </form>
        </Fragment>
    )
}

export default InputTodo;