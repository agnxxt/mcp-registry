# Nextcloud MCP Server

MCP server for [Nextcloud](https://nextcloud.com/) — files, shares, users, and apps via OCS and WebDAV APIs.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXTCLOUD_URL` | Yes | Base URL of your Nextcloud instance (e.g. `https://cloud.example.com`) |
| `NEXTCLOUD_USERNAME` | Yes | Nextcloud username for authentication |
| `NEXTCLOUD_PASSWORD` | Yes | Nextcloud password or app password |

## Tools (20)

### Files (WebDAV)
- **list_files** - List files/folders at a path (PROPFIND)
- **upload_file** - Upload file content to a path (PUT)
- **delete_file** - Delete a file or folder (DELETE)
- **create_folder** - Create a new folder (MKCOL)
- **move_file** - Move or rename a file/folder (MOVE)
- **copy_file** - Copy a file or folder (COPY)

### Shares (OCS)
- **list_shares** - List all file shares
- **create_share** - Create a new share (user, group, public link)
- **delete_share** - Delete a share by ID

### Users (OCS)
- **list_users** - List all users
- **get_user** - Get user details by ID
- **create_user** - Create a new user
- **list_groups** - List all groups

### Apps & System (OCS)
- **list_apps** - List installed apps
- **get_capabilities** - Get instance capabilities
- **get_status** - Get instance status and version
- **list_notifications** - List user notifications
- **search_files** - Search files by name/content

## Usage

```json
{
  "mcpServers": {
    "nextcloud": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "NEXTCLOUD_URL": "https://cloud.example.com",
        "NEXTCLOUD_USERNAME": "admin",
        "NEXTCLOUD_PASSWORD": "your-app-password"
      }
    }
  }
}
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```
