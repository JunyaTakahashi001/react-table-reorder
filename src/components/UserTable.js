import { useEffect, useState } from 'react';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  // userデータの取得
  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );
      const users = await response.json();
      setUsers(users);
    };
    getUsers();
  }, []);

  // ドラッグ要素の取得
  const dragStart = (index) => {
    setDragIndex(index);
  };

  // 並べ替え処理
  const dragEnter = (index) => {
    if (index === dragIndex) return;
    setUsers((prevState) => {
      let newUsers = JSON.parse(JSON.stringify(prevState));
      const deleteElement = newUsers.splice(dragIndex, 1)[0];
      newUsers.splice(index, 0, deleteElement);
      return newUsers;
    });

    setDragIndex(index);
  };

  // サーバへの並び替え後のデータ送信処理を追加
  const dragEnd = () => {
    setDragIndex(null)
  };

  return (
    <div style={{ margin: '2em' }}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>ユーザ名</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              draggable={true}
              onDragStart={() => dragStart(index)}
              onDragEnter={() => dragEnter(index)}
              onDragOver={(event) => event.preventDefault()} // 半透明の要素が元の場所に戻る動作を停止
              onDragEnd={dragEnd}
              className={index === dragIndex ? 'dragging' : ''}
            >
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;