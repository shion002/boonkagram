import "./ManuInput.css";

interface Menu {
  name: string;
  price: number;
}

interface MenuInputProps {
  menus: Menu[] | null;
  onChange: (menus: Menu[] | null) => void;
}

const MenuInput = ({ menus, onChange }: MenuInputProps) => {
  const handleAddMenu = () => {
    const newMenu = { name: "", price: 0 };
    onChange(menus ? [...menus, newMenu] : [newMenu]);
  };

  const handleMenuChange = (
    index: number,
    field: "name" | "price",
    value: string
  ) => {
    if (!menus) return;

    const updatedMenus = menus.map((menu, i) => {
      if (i !== index) return menu;

      if (field === "price") {
        return { ...menu, price: Number(value) || 0 };
      } else {
        return { ...menu, name: value };
      }
    });

    onChange(updatedMenus);
  };

  const handleMenuRemove = (index: number) => {
    if (!menus) return;

    const updatedMenus = menus.filter((_, i) => i !== index);
    onChange(updatedMenus.length > 0 ? updatedMenus : null);
  };

  return (
    <div className="menu-input">
      <div className="menu-input-header">
        <h2>메뉴</h2>
        <button type="button" className="add-btn" onClick={handleAddMenu}>
          + 메뉴 추가
        </button>
      </div>

      <div className="menu-list">
        {!menus || menus.length === 0 ? (
          <p className="empty-message">등록된 메뉴가 없습니다.</p>
        ) : (
          menus.map((menu, index) => (
            <div key={index} className="menu-item">
              <input
                type="text"
                placeholder="메뉴명"
                value={menu.name}
                onChange={(e) =>
                  handleMenuChange(index, "name", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="가격"
                value={menu.price || ""}
                onChange={(e) =>
                  handleMenuChange(index, "price", e.target.value)
                }
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleMenuRemove(index)}
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuInput;
