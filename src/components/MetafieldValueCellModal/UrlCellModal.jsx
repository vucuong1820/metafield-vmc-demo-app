import { ActionList, Button, ButtonGroup, Icon, InlineError, Popover, TextField } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import {
  CircleTickMajor,
  GlobeMajor,
  EmailMajor,
  PhoneMajor,
  ChatMajor,
} from "@shopify/polaris-icons";

function UrlCellModal({ onSetValue, value, error }) {
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  let urlValue;
  if(value){

    if(value.includes('http://') || value.includes('https://')) {
      urlValue = value.split('/')[value.split('/').length - 1]
    }else {
      urlValue = value.split(':')[value.split(':').length - 1]
    }

  }else {
    urlValue = ""
  }
  

  const protocol = value?.slice(0,value.lastIndexOf(urlValue)) || "https://"
  
  const listUnit = [
    {
      protocol: "https://",
      icon: CircleTickMajor,
    },
    {
      protocol: "http://",
      icon: GlobeMajor,
    },
    {
      protocol: "mailto:",
      icon: EmailMajor,
    },
    {
      protocol: "tel:",
      icon: PhoneMajor,
    },
    {
      protocol: "sms:",
      icon: ChatMajor,
    },
  ];

  const listUnitMarkup = listUnit.map((unit) => ({
    active: unit.protocol === protocol ? true : false,
    content: unit.protocol,
    icon: unit.icon,
    onAction() {
      setActive(false);
      onSetValue(`${unit.protocol}${urlValue}`)
    },
  }));
  const activator = (
    <Button onClick={toggleActive} disclosure>
      <Icon source={listUnit.find(x => x.protocol === protocol).icon} color="base"/>
    </Button>
  );
  return (
    <>
    <ButtonGroup segmented fullWidth>
      <Popover
        active={active}
        activator={activator}
        autofocusTarget="first-node"
        onClose={toggleActive}
      >
        <div style={{ maxHeight: "280px" }}>
          <ActionList
            actionRole="menuitem"
            sections={[
              {
                items: listUnitMarkup,
              },
            ]}
          />
        </div>
      </Popover>

      <TextField error={error ? true : false} value={urlValue} onChange={(value) => onSetValue(`${protocol}${value}`)}/>
    </ButtonGroup>
    <InlineError message={error || ""} />
    </>
  );
}

export default UrlCellModal;
