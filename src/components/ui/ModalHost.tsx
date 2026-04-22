// Практика урок 45
import { observer } from "mobx-react-lite";
import { useStores } from "../../store/useStores";
import ConfirmModal from "./ConfirmModal";
import ChangePasswordModal from "../student/ChangePasswordModal";

const ModalHost = observer(() => {
  const { modalStore } = useStores();

  return (
    <>
      <ConfirmModal
        open={modalStore.isConfirmOpen}
        text={modalStore.confirm?.text ?? ""}
        confirmLabel={modalStore.confirm?.confirmLabel ?? "Подтвердить"}
        cancelLabel={modalStore.confirm?.cancelLabel ?? "Отмена"}
        onConfirm={() => {
          modalStore.confirm?.onConfirm();
          modalStore.close();
        }}
        onClose={modalStore.close}
      />
      <ChangePasswordModal
        open={modalStore.isChangePasswordOpen}
        onClose={modalStore.close}
        onSuccess={() => {
          modalStore.close();
        }}
      />
    </>
  );
});

export default ModalHost;
