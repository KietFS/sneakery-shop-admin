import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OrderStatusBadge from "../../components/StatusBadge";
import { OrderStatusEnum } from "../../types/user";

const ITEM_HEIGHT = 48;

interface IChangeStatusActionMenu {
  options: {
    id: string;
    title: string;
    onPress: () => void;
    onActionSuccess: () => void;
  }[];

  status: OrderStatusEnum;  
}

const ChangeStatusActionMenu: React.FC<IChangeStatusActionMenu> = ({
  options,
  status,
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
        <OrderStatusBadge status={status} />
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
