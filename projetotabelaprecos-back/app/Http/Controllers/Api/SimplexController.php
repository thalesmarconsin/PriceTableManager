<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SimplexController extends Controller
{
    public function calcular(Request $request): JsonResponse
    {
        $produtos      = $request->input('produtos', []);
        $maxQuantidade = (float) $request->input('max_quantidade', 180);
        $orcamento     = (float) $request->input('orcamento', 0);

        if (empty($produtos)) {
            return response()->json(['error' => 'Nenhum produto informado.'], 422);
        }

        $lucros = array_map(fn($p) => (float) $p['lucro'], $produtos);
        $custos = array_map(fn($p) => (float) $p['custo'], $produtos);
        $n      = count($produtos);

        // Restrição de quantidade total
        $restricoes = [
            array_merge(array_fill(0, $n, 1.0), [$maxQuantidade]),
        ];

        // Restrição de orçamento (apenas se informado e se algum custo > 0)
        $temCusto = array_sum($custos) > 0;
        if ($orcamento > 0 && $temCusto) {
            $restricoes[] = array_merge($custos, [$orcamento]);
        }

        $resultado = $this->simplex($lucros, $restricoes);

        if ($resultado['status'] !== 'ótimo') {
            return response()->json($resultado);
        }

        $solucao         = [];
        $quantidadeUsada = 0;
        $orcamentoUsado  = 0;

        foreach ($produtos as $i => $produto) {
            $qtd              = round($resultado['solucao'][$i] ?? 0, 4);
            $solucao[]        = ['id' => $produto['id'], 'nome' => $produto['nome'], 'quantidade' => $qtd];
            $quantidadeUsada += $qtd;
            $orcamentoUsado  += $custos[$i] * $qtd;
        }

        return response()->json([
            'status'               => $resultado['status'],
            'lucro_maximo'         => round($resultado['lucro_maximo'], 2),
            'solucao'              => $solucao,
            'quantidade_utilizada' => round($quantidadeUsada, 4),
            'orcamento_utilizado'  => round($orcamentoUsado, 2),
            'iteracoes'            => $resultado['iteracoes'],
        ]);
    }

    private function simplex(array $lucros, array $restricoes): array
    {
        $n = count($lucros);
        $m = count($restricoes);

        $tableau = [];
        for ($i = 0; $i < $m; $i++) {
            $linha = array_fill(0, $n + $m + 1, 0.0);
            for ($j = 0; $j < $n; $j++) {
                $linha[$j] = $restricoes[$i][$j];
            }
            $linha[$n + $i]      = 1.0;
            $linha[$n + $m]      = $restricoes[$i][$n];
            $tableau[$i]         = $linha;
        }

        $linhaZ = array_fill(0, $n + $m + 1, 0.0);
        for ($j = 0; $j < $n; $j++) {
            $linhaZ[$j] = -$lucros[$j];
        }
        $tableau[$m] = $linhaZ;

        $basicas = range($n, $n + $m - 1);

        $iteracoes = 0;
        $maxIter   = 200;

        while ($iteracoes < $maxIter) {
            $colPivo = $this->colunaPivo($tableau[$m], $n + $m);
            if ($colPivo === -1) break;

            $linPivo = $this->linhaPivo($tableau, $colPivo, $m, $n + $m);
            if ($linPivo === -1) {
                return ['status' => 'ilimitado', 'lucro_maximo' => INF, 'iteracoes' => $iteracoes, 'solucao' => []];
            }

            $tableau             = $this->pivotar($tableau, $linPivo, $colPivo, $m);
            $basicas[$linPivo]   = $colPivo;
            $iteracoes++;
        }

        $solucao = array_fill(0, $n + $m, 0.0);
        for ($i = 0; $i < $m; $i++) {
            $solucao[$basicas[$i]] = $tableau[$i][$n + $m];
        }

        return [
            'status'       => 'ótimo',
            'lucro_maximo' => $tableau[$m][$n + $m],
            'solucao'      => $solucao,
            'iteracoes'    => $iteracoes,
        ];
    }

    private function colunaPivo(array $linhaZ, int $colunas): int
    {
        $minVal  = -1e-9;
        $colPivo = -1;
        for ($j = 0; $j < $colunas; $j++) {
            if ($linhaZ[$j] < $minVal) {
                $minVal  = $linhaZ[$j];
                $colPivo = $j;
            }
        }
        return $colPivo;
    }

    private function linhaPivo(array $tableau, int $colPivo, int $m, int $rhs): int
    {
        $minRatio = PHP_FLOAT_MAX;
        $linPivo  = -1;
        for ($i = 0; $i < $m; $i++) {
            if ($tableau[$i][$colPivo] > 1e-9) {
                $ratio = $tableau[$i][$rhs] / $tableau[$i][$colPivo];
                if ($ratio < $minRatio) {
                    $minRatio = $ratio;
                    $linPivo  = $i;
                }
            }
        }
        return $linPivo;
    }

    private function pivotar(array $tableau, int $linPivo, int $colPivo, int $m): array
    {
        $cols     = count($tableau[0]);
        $pivotVal = $tableau[$linPivo][$colPivo];

        for ($j = 0; $j < $cols; $j++) {
            $tableau[$linPivo][$j] /= $pivotVal;
        }

        for ($i = 0; $i <= $m; $i++) {
            if ($i === $linPivo) continue;
            $fator = $tableau[$i][$colPivo];
            for ($j = 0; $j < $cols; $j++) {
                $tableau[$i][$j] -= $fator * $tableau[$linPivo][$j];
            }
        }

        return $tableau;
    }
}
