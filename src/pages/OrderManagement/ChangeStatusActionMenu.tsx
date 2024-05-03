import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ITEM_HEIGHT = 48;

interface IChangeStatusActionMenu {
  options: {
    id: string;
    title: string;
    onPress: () => void;
    onActionSuccess: () => void;
  }[];

  label: string;
}

const ChangeStatusActionMenu: React.FC<IChangeStatusActionMenu> = ({
  options,
  label,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <button onClick={handleClick}>
        <p className="text-sm">{label}</p>
      </button>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option?.id}
            onClick={() => {
              option.onPress();
              handleClose();
            }}
          >
            {option?.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ChangeStatusActionMenu;
