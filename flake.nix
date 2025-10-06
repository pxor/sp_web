{
  description = "SvelteKit dev shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";        # your base
    unstable.url = "github:NixOS/nixpkgs/nixos-unstable";    # for newer node/pnpm
  };

  outputs = { self, nixpkgs, unstable }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
    u = import unstable { inherit system; };
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = [
        u.nodejs_22   # satisfies vite >=22.12.0 (or swap to u.nodejs_20 if >=20.19.0 is available)
        u.pnpm        # pnpm 10.x
      ];
      shellHook = ''echo "🟢 dev shell: Node $(node -v), pnpm $(pnpm -v)"'';
    };
  };
}