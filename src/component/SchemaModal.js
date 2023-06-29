import { useEffect, useState } from "react";
import { IoMdClose, IoMdRemoveCircleOutline } from "react-icons/io";
import { sentenceCase } from "sentence-case";
import { postnewschema } from "../action/apicall";


const dropdownSchema = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
]

export const SchemaModal = ({ showModal, handleModalClose, setSuccess }) => {
    const [schemaName, setSchemaName] = useState('')
    const [selectedSchema, setSelectedSchema] = useState('');
    const [addedSchemas, setAddedSchemas] = useState([]);
    const [schemaValues, setSchemaValues] = useState()
    const [availableSchemas, setAvailableSchemas] = useState(dropdownSchema);
    const [loading, setLoading] = useState(false)

    const initialState = () => {
        setSchemaValues("");
        setAddedSchemas([]);
        setSelectedSchema("");
        setSchemaName("");
        handleModalClose("")
        setLoading(false);
        setAvailableSchemas(dropdownSchema)
    }

    const handleSchemaChange = (event) => {
        setSelectedSchema(event.target.value);
    };

    const handleSchemaValues = (key, value) => {
        setSchemaValues((prevDetails) => ({
            ...prevDetails,
            [key]: value
        }));
    }

    const addSchema = () => {
        if (selectedSchema) {
            setAddedSchemas([...addedSchemas, selectedSchema]);
            setAvailableSchemas(
                availableSchemas.filter((schema) => schema.value !== selectedSchema)
            );
            setSelectedSchema('');
        }
    };

    const removeSchema = (schema) => {
        const removeItem = addedSchemas.filter((item) => item !== schema)
        setAddedSchemas(removeItem)
        const addRemovedItem = [...availableSchemas, { label: schema.length ? sentenceCase(schema) : null, value: schema }];
        setAvailableSchemas(addRemovedItem);
    }
    const sendData = async (event) => {
        event.preventDefault();
        if (schemaName && (schemaValues &&Object.keys(schemaValues).every(key => schemaValues[key] !== ''))) {
            setLoading(true)
            const response = await postnewschema({
                "segment_name": schemaName,
                "schema": schemaValues && Object.entries(schemaValues).map(([key, value]) => ({ [key]: value }))
            })
            if (response) {
                initialState();
                setSuccess(true)
            }
            setLoading(false);
        }
    }


    return (
        <div className={`right-panel-modal ${showModal ? 'show' : 'hidden'}`} >
            <div className="right-panel-content shadow p-3 mb-5 bg-white rounded" >
                <div className="right-panel-header">
                    <h5 className='font-weight-bold'>Saving Segment</h5>
                    <button className="close-button" onClick={initialState}>
                        <IoMdClose />
                    </button>
                </div>
                <form onSubmit={sendData}>
                    <div className="right-panel-body">

                        <div className="form-group">
                            <label>Enter the Name of the Segment</label>
                            <input type="text" className="form-control" id="segment" placeholder="Name of the Segment" onChange={(e) => setSchemaName(e.target.value)} value={schemaName} />
                        </div>
                        <div className='mt-3 text-secondary'>
                            <p>To save your segment, you need to add the schemas to build the query</p>
                        </div>
                        {
                            addedSchemas?.length ?
                                <div className='container backgroundLight'>
                                    {
                                        addedSchemas?.map((schema, index) =>
                                            <div className="form-group mt-2 " key={index}>
                                                <label>{schema?.length && sentenceCase(schema)}</label>
                                                <div className='d-flex justfy-content-between align-items-center'>
                                                    <input type="text" className="form-control me-1" id={schema} placeholder={`Enter the ${schema?.length && sentenceCase(schema)}`} onChange={(e) => handleSchemaValues(schema, e.target.value)} required />
                                                    <IoMdRemoveCircleOutline size={20} className='pointer' onClick={() => removeSchema(schema)} />
                                                </div>
                                            </div>)
                                    }
                                </div> : null
                        }
                        <div>
                            <select value={selectedSchema} onChange={handleSchemaChange} className='form-select mt-3'>
                                <option value="">Select a schema to add</option>
                                {availableSchemas?.sort((a, b) => a.label.localeCompare(b.label))?.map((schema) => (
                                    <option key={schema.value} value={schema.value}>
                                        {schema.label}
                                    </option>
                                ))}
                            </select>
                            <br />
                            {
                                selectedSchema && <a onClick={addSchema} className='pointer' >{`+ Add new schema`}</a>
                            }
                        </div>
                    </div>
                    <br /><br />
                    <div className="right-panel-footer d-flex justify-content-end">
                        <button className="btn btn-primary d-flex justify-content-center align-items-center">
                            {loading && <div class="spinner-border text-light " role="status" style={{ height: 15, width: 15 }}>
                                <span class="sr-only"></span>
                            </div>}
                            {'Save the Segment'}</button>
                        <button className="btn btn-danger ms-2" onClick={initialState}> {'cancel'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}