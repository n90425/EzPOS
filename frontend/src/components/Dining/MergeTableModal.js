import TableSelectionModal from "./TableSelectionModal";

function MergeTableModal({tables, onClose, onMerge}) {
    return (
        <TableSelectionModal
            title="합석할 테이블을 선택하세요"
            tables={tables}
            onClose={onClose}
            onConfirm={onMerge}
        />
    )
}

export default MergeTableModal;