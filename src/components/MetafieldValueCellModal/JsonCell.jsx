import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, ButtonGroup, Icon, Listbox, Stack, TextField } from "@shopify/polaris";
import { CirclePlusMinor } from "@shopify/polaris-icons";
JsonCell.propTypes = {};

function JsonCell({ onSetValue, value, error }) {


  return (
    <div>
      <TextField 
      error={error || false}
      value={value}
      onChange={(value) => onSetValue(value)}
      />
    </div>
  );
}

export default JsonCell;
