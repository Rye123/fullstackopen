import React from 'react';

const Entry = ({person, deleteEntry}) => {
    return (
        <div>
            {person.name} ({person.number}) <button onClick={deleteEntry}>delete</button>
        </div>
    );
};

export default Entry;

