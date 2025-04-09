
import TableSelectionModal from "./TableSelectionModal";

function MoveTableModal({tables, onClose, onMove}) {
    return (
        <TableSelectionModal
            title="이동할 테이블을 선택하세요"
            tables={tables}
            onClose={onClose}
            onConfirm={onMove}
        />
    )
}

export default MoveTableModal;