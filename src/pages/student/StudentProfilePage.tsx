// Практика урок 19, урок 20, урок 21, урок 22
/** @jsxImportSource @emotion/react */
import { useState } from "react";
import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import StudentHeader from "../../components/student/StudentHeader";
import { LinkIcon } from "../../icons/icons";
import ChangePasswordModal from "../../components/student/ChangePasswordModal";
import Toast from "../../components/ui/Toast";

type GroupTag = { code: string; course: string; track: string };
type ProfileData = {
  fullName: string;
  nick?: string;
  avatarUrl?: string;
  social?: { label: string; url: string };
  groups: GroupTag[];
};

const Block = styled.section`
  display: flex;
  gap: 30px;
  padding: 24px 0;
`;

const AvatarBox = styled.div`
  width: 350px;
  height: 350px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eaecf0;
  background: #fff;
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoCol = styled.div`
  min-width: 0;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 4px 0 8px;
`;

const FullName = styled.span`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.35;
`;

const Badge = styled.span`
  background: #e8f5ff;
  color: #4094f7;
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  padding: 6px 10px;
  line-height: 1;
  letter-spacing: -0.02em;
`;

const LinkRow = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #344054;
  text-decoration: none;
  font-size: 14px;
  margin: 2px 0 14px;
  &:hover {
    text-decoration: underline;
  }
`;

const Groups = styled.div`
  display: grid;
  gap: 6px;
  margin-bottom: 18px;
`;

const GroupLine = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  line-height: 1.35;
  .code {
    font-weight: 600;
    color: #101828;
  }
  .muted {
    color: #667085;
  }
`;

const Dot = styled.span`
  width: 4px;
  height: 4px;
  background: #d0d5dd;
  border-radius: 50%;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 6px;
`;

const Btn = styled.button`
  appearance: none;
  border: 1px solid #eaecf0;
  background: #ffffff;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
  color: #101828;
  cursor: pointer;
  transition: background-color 0.15s ease;
  &:hover {
    background: #f9fafb;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StudentProfilePage = observer(() => {
  const [pwdOpen, setPwdOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [profile] = useState<ProfileData>({
    fullName: "Фильченко Диана Игоревна",
    nick: "код",
    avatarUrl:
      "https://images.unsplash.com/photo-1606335543042-57c525922933?q=80&w=640&auto=format&fit=facearea&facepad=3&h=640",
    social: { label: "vk.com/id565257045", url: "https://vk.com/id565257045" },
    groups: [
      { code: "КД18", course: "2 курс", track: "UX/UI" },
      { code: "КД18", course: "2 курс", track: "Frontend" },
    ],
  });

  function onChangePassword() {
    setPwdOpen(true);
  }

  return (
    <>
      <StudentHeader title="Профиль" />
      <Block>
        <div>
          <AvatarBox>
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.fullName} /> : null}
          </AvatarBox>
        </div>
        <InfoCol>
          <NameRow>
            <FullName>{profile.fullName}</FullName>
            {profile.nick && <Badge>{profile.nick}</Badge>}
          </NameRow>
          {profile.social && (
            <LinkRow href={profile.social.url} target="_blank" rel="noreferrer">
              <LinkIcon />
              {profile.social.label}
            </LinkRow>
          )}
          <Groups>
            {profile.groups.map((g, i) => (
              <GroupLine key={`${g.code}-${i}`}>
                <span className="code">{g.code}</span>
                <Dot />
                <span className="muted">{g.course}</span>
                <Dot />
                <span className="muted">{g.track}</span>
              </GroupLine>
            ))}
          </Groups>
          <Actions>
            <Btn disabled>Поменять фото</Btn>
            <Btn onClick={onChangePassword}>Изменить пароль</Btn>
          </Actions>
        </InfoCol>
      </Block>
      <ChangePasswordModal
        open={pwdOpen}
        onClose={() => setPwdOpen(false)}
        onSuccess={() => {
          setToastOpen(true);
        }}
      />
      <Toast open={toastOpen} message="Сохранения изменены" onClose={() => setToastOpen(false)} />
    </>
  );
});

export default StudentProfilePage;
