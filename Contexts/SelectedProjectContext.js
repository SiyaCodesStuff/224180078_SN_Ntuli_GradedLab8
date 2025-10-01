import React, { createContext, useState } from "react";

export const SelectedProjectContext = createContext({
  selectedProject: null,
  setSelectedProject: () => {}
});

export const SelectedProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <SelectedProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </SelectedProjectContext.Provider>
  );
};