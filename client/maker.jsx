const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#domoName').value;
  const age = e.target.querySelector('#domoAge').value;
  const lifeSavings = e.target.querySelector('#domoSavings').value;

  if (!name || !age || !lifeSavings) {
    helper.handleError('All fields are required!');
    return false;
  }

  helper.sendPost(
    e.target.action,
    { name, age, lifeSavings },
    onDomoAdded,
  );

  return false;
};

const handleDelete = async (id, onDeleted) => {
  helper.hideError();

  try {
    const response = await fetch('/deleteDomo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (result.error) {
      helper.handleError(result.error);
      return;
    }

    if (onDeleted) {
      onDeleted();
    }
  } catch (err) {
    helper.handleError('Error deleting domo!');
  }
};

const DomoForm = (props) => (
  <form
    id="domoForm"
    name="domoForm"
    onSubmit={(e) => handleDomo(e, props.triggerReload)}
    action="/maker"
    method="POST"
    className="domoForm"
  >
    <label htmlFor="name">Name: </label>
    <input id="domoName" type="text" name="name" placeholder="Domo Name" />

    <label htmlFor="age">Age: </label>
    <input id="domoAge" type="number" min="0" name="age" placeholder="Age" />

    <label htmlFor="lifeSavings">Life Savings: </label>
    <input
      id="domoSavings"
      type="number"
      min="0"
      name="lifeSavings"
      placeholder="Life Savings"
    />

    <input
      className="makeDomoSubmit"
      type="submit"
      value="Make Domo"
    />
  </form>
);

const DomoList = (props) => {
  const [domos, setDomos] = useState(props.domos);

  useEffect(() => {
    const loadDomosFromServer = async () => {
      const response = await fetch('/getDomos');
      const data = await response.json();
      setDomos(data.domos);
    };

    loadDomosFromServer();
  }, [props.reloadDomos]);

  if (domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos Yet!</h3>
      </div>
    );
  }

  const domoNodes = domos.map((domo) => (
    <div key={domo._id} className="domo">
      <img
        src="/assets/img/domoface.jpeg"
        alt="domo face"
        className="domoFace"
      />
      <h3 className="domoName">Name: {domo.name}</h3>
      <h3 className="domoSavings">
        Life Savings: ${domo.lifeSavings}
      </h3>
      <h3 className="domoAge">Age: {domo.age}</h3>

      <button
        type="button"
        className="deleteDomoSubmit"
        onClick={() => handleDelete(domo._id, props.triggerReload)}
      >
        Delete
      </button>
    </div>
  ));

  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const App = () => {
  const [reloadDomos, setReloadDomos] = useState(false);
  const triggerReload = () => {
    setReloadDomos((prev) => !prev);
  };

  return (
    <div>
      <div id="makeDomo">
        <DomoForm triggerReload={triggerReload} />
      </div>
      <div id="domos">
        <DomoList
          domos={[]}
          reloadDomos={reloadDomos}
          triggerReload={triggerReload}
        />
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />);
};

window.onload = init;
