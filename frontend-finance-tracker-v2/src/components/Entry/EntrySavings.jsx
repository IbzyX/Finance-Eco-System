import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineEdit } from "react-icons/ai";
import { showSuccess, showWarning } from "../../utils/toast";
import { useAuth0 } from "@auth0/auth0-react";
import "../../pages/css/EntryForm.css";

export default function EntrySavings() {
  const [saving, setSaving] = useState([]);
  const [editingSavings, setEditingSavings ] = useState(null);
  const [newSaving, setNewSaving] = useState({
    goal: "",
    startDate: "",
    initialAmount: "",
    contributionInterval: "",
    contributionAmount: "",
    targetDate: "",
    targetAmount: "",
    aer: "",
  });
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();


  // -- Load savings
  useEffect(() => {
    const fetchSavings = async () => {
      try { 
        const token = await getAccessTokenSilently();
        const res = await fetch("http://localhost:5000/api/savings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setSaving(data);
      } catch (err) {
        console.error("error fetching savings: ", err);
      }
    };
    if (isAuthenticated) {
      fetchSavings();
    }
  }, []);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSaving((prev) => ({ ...prev, [name]: value }));
  };



  // -- add new savings
  const addSaving = async () => {
    if (
      !newSaving.goal.trim() ||
      !newSaving.startDate ||
      !newSaving.initialAmount ||
      !newSaving.contributionInterval ||
      !newSaving.contributionAmount ||
      !newSaving.targetDate ||
      !newSaving.targetAmount ||
      !newSaving.aer
    ) {
      showWarning("Please fill all fields before adding Savings.");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:5000/api/savings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newSaving,
          startDate: newSaving.startDate,
          initialAmount: newSaving.initialAmount,
          contributionInterval: newSaving.contributionInterval,
          contributionAmount: newSaving.contributionAmount,
          targetDate: newSaving.targetDate,
          targetAmount: newSaving.targetAmount,
          aer: newSaving.aer,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.log("SERVER ERROR:", errorText);
        throw new Error("Failed to save Savings");
      }
      const savedSavings = await res.json();
      setSaving(prev => [...prev, savedSavings]);

      showSuccess(`Savings "${newSaving.goal}" added successfully!`);

        setNewSaving({
          goal: "",
          startDate: "",
          initialAmount: "",
          contributionInterval: "",
          contributionAmount: "",
          targetDate: "",
          targetAmount: "",
          aer: "",
        });
    
    } catch (err) {
      console.error("Error adding savings: ", err);
    }
  };


  // -- delete savings 
  const removeSaving = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await fetch(`http://localhost:5000/api/savings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSaving(prev => prev.filter(saving => saving.id !== id));
      showSuccess("savings removed successfully!");
    } catch (err) {
        console.error("Error deleting saving: ", err);
    }
  };

  const handleUpdateSaving = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`http://localhost:5000/api/savings/${editingSavings.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingSavings),
        }
      );
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();

      setSaving((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      showSuccess("Savings updated successfully!");
      setEditingSavings(null);
    } catch (err) {
      console.error("Update Error: ", err);
    }
    
  };

  return (
    <div
      style={{
        color: "white",
        borderRadius: "15px",
        width: "100%",
        maxWidth: "950px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          textDecoration: "underline",
          marginBottom: "1.5rem",
        }}
      >
        Savings
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr)) 50px",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
          borderBottom: "2px solid #9cff66",
          paddingBottom: "2rem",
        }}
      >
        <input
          type="text"
          name="goal"
          placeholder="Goal"
          value={newSaving.goal}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
            type="text"
            name="startDate"
            placeholder="Start Date"
            value={newSaving.startDate}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
            }}
            onChange={handleChange}
            style={inputStyle}
        />


        <input
          type="number"
          name="initialAmount"
          placeholder="Initial Amount"
          value={newSaving.initialAmount}
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="contributionInterval"
          value={newSaving.contributionInterval}
          onChange={handleChange}
          style={{
            ...inputStyle,
            backgroundColor: "#2b2b2b",
            borderRadius: "5px",
            color: "white",
            textAlign: "center",
          }}
        >
          <option value="">Contribution Intervals</option>
          <option value="no">One-off</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="fortnightly">Fortnightly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="biannually">Bi-Annually</option>
          <option value="annually">Annually</option>
        </select>

        <input
          type="number"
          name="contributionAmount"
          placeholder="Contribution Amount"
          value={newSaving.contributionAmount}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
            type="text"
            name="targetDate"
            placeholder="Target Date"
            value={newSaving.targetDate}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
            }}
            onChange={handleChange}
            style={inputStyle}
        />

        <input
          type="number"
          name="targetAmount"
          placeholder="Target Amount"
          value={newSaving.targetAmount}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="number"
          name="aer"
          placeholder="AER (%)"
          value={newSaving.aer}
          onChange={handleChange}
          style={inputStyle}
        />

        <button onClick={addSaving} style={buttonAddStyle}>
          <AiOutlinePlus />
        </button>
      </div>

      {saving.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr style={{ color: "#9cff66"}}>
              <th>Goal</th>
              <th>Start<br/>Date</th>
              <th>Initial<br/>Amount</th>
              <th>Contribution<br/>Interval</th>
              <th>Contribution<br/>Amount</th>
              <th>Target<br/>Date</th>
              <th>Target<br/>Amount</th>
              <th>AER (%)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {saving.map((saving, i) => (
              <tr key={saving.id}>
                <td>{saving.goal}</td>
                <td>{saving.startDate}</td>
                <td>£{saving.initialAmount}</td>
                <td>{saving.contributionInterval}</td>
                <td>{saving.contributionAmount}</td>
                <td>{saving.targetDate}</td>
                <td>£{saving.targetAmount}</td>
                <td>{saving.aer}</td>
                <td>
                  <button
                    onClick={() => setEditingSavings(saving)}
                    style={buttonEditStyle}
                  >
                    <AiOutlineEdit />
                  </button>

                  <button
                    onClick={() => removeSaving(saving.id)}
                    style={buttonRemoveStyle}
                  >
                    <AiOutlineMinus />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#888" }}>
          No Saving added yet.
        </p>
      )}

      {editingSavings && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignContent: "center", 
              fontSize: "1.25rem",
            }}>
              Edit Savings
              
              <button
                onClick={() => setEditingSavings(null)}
                style={{ 
                  gap:"2rem", 
                  fontSize: "1.25rem", 
                  color: "red", 
                  backgroundColor: "#1e1e1e", 
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>

            </h3>
            

            <div style={formGroupStyle}>
              <label>Goal</label>
              <input
                type="text"
                value={editingSavings.goal}
                onChange={(e) => setEditingSavings({ ...editingSavings, goal: e.target.vaule })}
                style={inputStyle}
              />
            </div>
            
            <div style={formGroupStyle}>
            <label>Start Date</label>
            <input  
              type="date"
              value={editingSavings.startDate}
              onChange={(e) => setEditingSavings({ ...editingSavings, startDate: e.target.value })}
              style={inputStyle}
            />
            </div>

            <div style={formGroupStyle}>
            <label>Ininial Amount</label>
            <input  
              type="number"
              value={editingSavings.initialAmount}
              onChange={(e) => setEditingSavings({ ...editingSavings, initialAmount: e.target.value })}
              style={inputStyle}
            />
            </div>

            <div style={formGroupStyle}>
              <label>Contribution Interval</label>
              <select  
                value={editingSavings.contributionInterval}
                onChange={(e) => setEditingSavings({ ...editingSavings, contributionInterval: e.target.value })}
                style={{
                  ...inputStyle,
                  backgroundColor: "#1e1e1e",
                  borderRadius: "5px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <option value="">Contribution Intervals</option>
                <option value="no">One-off</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="biannually">Bi-Annually</option>
                <option value="annually">Annually</option>
              </select>
            </div>

            <div style={formGroupStyle}>
            <label>Contribution Amount</label>
            <input  
              type="number"
              value={editingSavings.contributionAmount}
              onChange={(e) => setEditingSavings({ ...editingSavings, contributionAmount: e.target.value })}
              style={inputStyle}
            />
            </div>

            <div style={formGroupStyle}>
            <label>Target Date</label>
            <input  
              type="date"
              value={editingSavings.targetDate}
              onChange={(e) => setEditingSavings({ ...editingSavings, targetDate: e.target.value })}
              style={inputStyle}
            />
            </div>

            <div style={formGroupStyle}>
            <label>Target Amount</label>
            <input  
              type="number"
              value={editingSavings.targetAmount}
              onChange={(e) => setEditingSavings({ ...editingSavings, targetAmount: e.target.value })}
              style={inputStyle}
            />
            </div>

            <div style={formGroupStyle}>
            <label>AER %</label>
            <input  
              type="number"
              value={editingSavings.aer}
              onChange={(e) => setEditingSavings({ ...editingSavings, aer: e.target.value })}
              style={inputStyle}
            />
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems:"center", gap: "10px", marginTop: "20px" }}>
              <button onClick={handleUpdateSaving} style={{
                backgroundColor: "#9cff66",
                border: "#000",
                borderRadius: "20px",
                padding: "10px 20px",
                fontWeight: "bold",
                color: "#000",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}>
                Save
              </button>

              
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const inputStyle = {
  background: "transparent",
  border: "none",
  color: "white",
  padding: "0.25rem",
  fontSize: "0.9rem",
  textAlign: "center",
  width: "100%",
  boxSizing: "border-box",
};


const tableStyle = {
width: "100%",
borderCollapse: "collapse",
textAlign: "center",
justifyContent: "center",
color: "white"
};

const buttonEditStyle = {
  backgroundColor: "#6ce5e8",
  border: "none",
  borderRadius: "50%",
  color: "#000",
  fontSize: "1.2rem",
  width: "30px",
  height: "30px",
  cursor: "pointer",
  marginRight: "5px",
};

const buttonAddStyle = {
  backgroundColor: "#9cff66",
  border: "none",
  borderRadius: "50%",
  color: "#000",
  fontSize: "1.5rem",
  width: "40px",
  height: "40px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const buttonRemoveStyle = {
  backgroundColor: "#9cff66",
  border: "none",
  borderRadius: "50%",
  color: "#000",
  fontSize: "1.2rem",
  width: "30px",
  height: "30px",
  cursor: "pointer",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#1e1e1e",
  padding: "2rem",
  borderRadius: "15px",
  width: "400px",
  display: "flex",
  flexDirection: "column",
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "12px",
  textAlign: "left",
  color: "#9cff66",
  fontSize: "0.9rem",
  borderBottom: "0.5px dashed white"
};
