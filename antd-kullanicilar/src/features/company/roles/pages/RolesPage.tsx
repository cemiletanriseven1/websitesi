import React from "react";
import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRoles } from "../store";
import type { Role } from "../types";
import RoleForm from "../components/RoleForm";
import "../roles.css";

export default function RolesPage() {
    const { roles } = useRoles();

    const cols: ColumnsType<Role> = [
        { title: "Rol", dataIndex: "name", key: "name" },
        {
            title: "Yetkiler",
            dataIndex: "permissions",
            key: "perms",
            render: (perms: Role["permissions"]) => (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {perms.map(p => <Tag key={p}>{p}</Tag>)}
                </div>
            )
        },
    ];

    return (
        <>
            <RoleForm />
            <Card className="roles-card">
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Roller</div>
                <Table<Role>
                    rowKey="id"
                    columns={cols}
                    dataSource={roles}
                    pagination={{ pageSize: 6, showSizeChanger: false }}
                    size="middle"
                />
            </Card>
        </>
    );
}
